import type { Handler } from '@netlify/functions'

interface ProxyRequestBody {
  sentence1?: string
  sentence2?: string
  sentence?: string
  feedbackMode?: 'journal_pair' | 'single_sentence'
  level?: number
  sentenceIndex?: number
  tierContext: string
  topic: string
  languageFunction: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
}

function extractOpenAIText(data: any): string {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text
  }

  const outputs = Array.isArray(data?.output) ? data.output : []
  const parts: string[] = []

  for (const item of outputs) {
    const content = Array.isArray(item?.content) ? item.content : []
    for (const c of content) {
      if (typeof c?.text === 'string') parts.push(c.text)
      if (typeof c?.output_text === 'string') parts.push(c.output_text)
    }
  }

  return parts.join('\n').trim()
}

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' }
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' })
  }

  const openAiSandboxKey = process.env.OPENAI_SANDBOX_API_KEY || process.env.OPENAI_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY
  if (!openAiSandboxKey && !geminiKey) {
    return jsonResponse(500, { error: 'No sandbox AI key configured (OPENAI_SANDBOX_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY)' })
  }

  // Parse and validate request body
  let body: ProxyRequestBody
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON body' })
  }

  const feedbackMode = body.feedbackMode || 'journal_pair'
  const { sentence1, sentence2, sentence, tierContext, topic, languageFunction } = body

  if (!tierContext || !topic || !languageFunction) {
    return jsonResponse(400, { error: 'Missing required fields' })
  }

  if (feedbackMode === 'single_sentence') {
    if (!sentence) {
      return jsonResponse(400, { error: 'Missing sentence for single_sentence mode' })
    }
    if (sentence.length > 500) {
      return jsonResponse(400, { error: 'Input too long' })
    }
  } else if (!sentence1 || !sentence2) {
    return jsonResponse(400, { error: 'Missing required fields' })
  } else if (sentence1.length > 500 || sentence2.length > 500) {
    return jsonResponse(400, { error: 'Input too long' })
  }

  const systemPrompt =
    feedbackMode === 'single_sentence'
      ? `You are a friendly English teacher for Spanish-speaking children (3rd grade, PVUSD ELD program). Review ONE student sentence and provide kind, short bilingual feedback.

${tierContext}

The writing prompt topic was: "${topic}" (language function: ${languageFunction}).

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "whatYouDidWell": {
    "english": "One short positive sentence.",
    "spanish": "Una frase positiva corta."
  },
  "oneStepToImprove": {
    "english": "One short improvement step.",
    "spanish": "Un paso corto para mejorar."
  },
  "suggestedSentence": {
    "english": "A corrected sentence that is natural and age-appropriate.",
    "spanish": "Traducción de apoyo en español."
  },
  "microPractice": {
    "english": "One tiny practice task using the same grammar pattern.",
    "spanish": "Una práctica corta con el mismo patrón."
  }
}

Rules:
- Be kind and encouraging.
- Keep sentences short and third-grade friendly.
- No criticism words like "wrong" or "bad".
- The suggested sentence must be grammatical and logical.`
      : `You are a friendly English teacher for Spanish-speaking children (3rd grade, PVUSD ELD program). Review their 2-sentence journal entry and provide gentle, encouraging feedback.

${tierContext}

The writing prompt topic was: "${topic}" (language function: ${languageFunction}).

IMPORTANT: Rewrite their sentences to be grammatically correct AND natural-sounding English. Don't just fix punctuation - improve word choice, verb tenses, and expressions.

Examples of improvements:
- "I eated a sandwhich at morning time" → "I ate a sandwich for breakfast"
- "I have 10 years old" → "I am 10 years old"
- "I go to the house" → "I went home" or "I am going home"
- "I like play soccer" → "I like playing soccer" or "I like to play soccer"

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "corrected": "The improved, natural-sounding version of their 2 sentences",
  "suggestions": ["1-2 specific tips to improve, phrased positively"],
  "encouragement": "A warm, encouraging message in Spanish",
  "score": number from 1-100 based on effort and correctness,
  "grammarExplanations": {
    "english": "Clear explanation in English about what makes the corrected sentences grammatically correct and why the changes were needed.",
    "spanish": "Clear explanation in Spanish about what makes the corrected sentences grammatically correct and why the changes were needed."
  }
}

Keep suggestions simple and age-appropriate. Be encouraging! Provide clear grammar explanations that help the child understand the rules.`

  try {
    let aiResponse = ''

    if (openAiSandboxKey) {
      const userPrompt =
        feedbackMode === 'single_sentence'
          ? `Here is my sentence:\n${sentence}`
          : `Here are my 2 sentences:\n1. ${sentence1}\n2. ${sentence2}`

      const openAiRequestBase = {
        input: [
          { role: 'system', content: [{ type: 'input_text', text: systemPrompt }] },
          { role: 'user', content: [{ type: 'input_text', text: userPrompt }] },
        ],
        max_output_tokens: 512,
      }

      const modelCandidates = ['o3-mini']

      let openAiData: any = null
      let openAiLastError = ''
      let openAiModelUsed = ''

      for (const model of modelCandidates) {
        // Try stricter JSON mode first, then fall back to plain text if unsupported.
        const openAiAttempts = [
          { ...openAiRequestBase, model, text: { format: { type: 'json_object' } } },
          { ...openAiRequestBase, model },
        ]

        for (const body of openAiAttempts) {
          const response = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openAiSandboxKey}`,
            },
            body: JSON.stringify(body),
          })

          if (!response.ok) {
            const errorText = await response.text()
            openAiLastError = errorText
            console.error('OpenAI API error:', response.status, errorText)
            continue
          }

          openAiData = await response.json()
          openAiModelUsed = model
          break
        }

        if (openAiData) break
      }

      if (!openAiData) {
        return jsonResponse(502, {
          error: 'AI service error',
          provider: 'openai',
          detail: openAiLastError.slice(0, 500),
        })
      }

      aiResponse = extractOpenAIText(openAiData)
      if (!aiResponse) {
        return jsonResponse(502, {
          error: 'Empty AI response',
          provider: 'openai',
          model: openAiModelUsed || 'unknown',
          detail: JSON.stringify(openAiData).slice(0, 500),
        })
      }
    } else {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text:
                      feedbackMode === 'single_sentence'
                        ? `Here is my sentence:\n${sentence}`
                        : `Here are my 2 sentences:\n1. ${sentence1}\n2. ${sentence2}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 512,
              responseMimeType: 'application/json',
            },
          }),
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Gemini API error:', response.status, errorText)
        return jsonResponse(502, { error: 'AI service error', provider: 'gemini' })
      }

      const data = await response.json()
      aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    }

    // Parse JSON from AI response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return jsonResponse(502, { error: 'Could not parse AI response', detail: aiResponse.slice(0, 500) })
    }

    try {
      const feedback = JSON.parse(jsonMatch[0])
      return jsonResponse(200, feedback)
    } catch {
      return jsonResponse(502, { error: 'Invalid JSON in AI response', detail: aiResponse.slice(0, 500) })
    }
  } catch (err) {
    console.error('Proxy error:', err)
    return jsonResponse(500, { error: 'Internal server error' })
  }
}

export { handler }
