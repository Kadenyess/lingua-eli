import type { Handler } from '@netlify/functions'

interface ProxyRequestBody {
  sentence1: string
  sentence2: string
  tierContext: string
  topic: string
  languageFunction: string
}

const handler: Handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const openAiSandboxKey = process.env.OPENAI_SANDBOX_API_KEY || process.env.OPENAI_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY
  if (!openAiSandboxKey && !geminiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'No sandbox AI key configured (OPENAI_SANDBOX_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY)' }),
    }
  }

  // Parse and validate request body
  let body: ProxyRequestBody
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) }
  }

  const { sentence1, sentence2, tierContext, topic, languageFunction } = body
  if (!sentence1 || !sentence2 || !tierContext || !topic || !languageFunction) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) }
  }

  // Limit input length to prevent abuse
  if (sentence1.length > 500 || sentence2.length > 500) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Input too long' }) }
  }

  const systemPrompt = `You are a friendly English teacher for Spanish-speaking children (3rd grade, PVUSD ELD program). Review their 2-sentence journal entry and provide gentle, encouraging feedback.

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
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiSandboxKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-5-nano',
          input: [
            { role: 'system', content: [{ type: 'input_text', text: systemPrompt }] },
            {
              role: 'user',
              content: [{ type: 'input_text', text: `Here are my 2 sentences:\n1. ${sentence1}\n2. ${sentence2}` }],
            },
          ],
          max_output_tokens: 512,
          temperature: 0.7,
          text: {
            format: { type: 'json_object' },
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('OpenAI API error:', response.status, errorText)
        return { statusCode: 502, body: JSON.stringify({ error: 'AI service error' }) }
      }

      const data = await response.json()
      aiResponse = data.output_text || ''
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
                parts: [{ text: `Here are my 2 sentences:\n1. ${sentence1}\n2. ${sentence2}` }],
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
        return { statusCode: 502, body: JSON.stringify({ error: 'AI service error' }) }
      }

      const data = await response.json()
      aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    }

    if (!aiResponse) {
      return { statusCode: 502, body: JSON.stringify({ error: 'Empty AI response' }) }
    }

    // Parse JSON from AI response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { statusCode: 502, body: JSON.stringify({ error: 'Could not parse AI response' }) }
    }

    try {
      const feedback = JSON.parse(jsonMatch[0])
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      }
    } catch {
      return { statusCode: 502, body: JSON.stringify({ error: 'Invalid JSON in AI response' }) }
    }
  } catch (err) {
    console.error('Proxy error:', err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) }
  }
}

export { handler }
