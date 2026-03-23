const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'

export interface ClaudeAIResponse {
  suggestedWeight: number
  weightRange: { min: number; max: number }
  confidence: number
  reasoning: string
  flags: string[]
  suggestedDimensions?: {
    length: number
    width: number
    height: number
  }
}

export async function getAIWeightSuggestionFromClaude(
  description: string,
  declaredWeight?: number
): Promise<ClaudeAIResponse | null> {
  if (!CLAUDE_API_KEY) {
    console.warn('Claude API key not configured, using rule-based fallback')
    return null
  }

  try {
    const prompt = `You are a logistics expert helping estimate package weights. Given the item description: "${description}"${declaredWeight ? ` Declared weight: ${declaredWeight}kg` : ''}. Analyze and provide JSON with: suggestedWeight, weightRange (min/max), confidence (0-100), reasoning, flags, and suggestedDimensions (L/W/H in cm).`

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      console.error('Claude API error:', response.status)
      return null
    }

    const data = await response.json()
    const content = data.content?.[0]?.text
    
    if (!content) {
      return null
    }

    const parsed = JSON.parse(content)
    
    const flags: string[] = []
    if (declaredWeight) {
      const ratio = declaredWeight / parsed.suggestedWeight
      if (ratio < 0.3) {
        flags.push(`Declared weight (${declaredWeight}kg) seems unusually low`)
      } else if (ratio > 3) {
        flags.push(`Declared weight (${declaredWeight}kg) seems unusually high`)
      }
    }

    return {
      suggestedWeight: parsed.suggestedWeight,
      weightRange: parsed.weightRange,
      confidence: parsed.confidence,
      reasoning: parsed.reasoning,
      flags,
      suggestedDimensions: parsed.suggestedDimensions,
    }
  } catch (error) {
    console.error('Claude API call failed:', error)
    return null
  }
}

export async function validatePackageDimensions(
  weight: number,
  dimensions: { length: number; width: number; height: number }
): Promise<{ isValid: boolean; warnings: string[] }> {
  const warnings: string[] = []
  
  const volumetricWeight = (dimensions.length * dimensions.width * dimensions.height) / 5000
  const ratio = weight / volumetricWeight
  
  if (ratio < 0.3) {
    warnings.push(`Volumetric weight (${volumetricWeight.toFixed(2)}kg) significantly exceeds actual weight`)
  } else if (ratio > 5) {
    warnings.push('Actual weight significantly exceeds volumetric weight')
  }
  
  if (dimensions.length > 200 || dimensions.width > 200 || dimensions.height > 200) {
    warnings.push('Dimensions exceed 200cm - may require freight service')
  }
  
  if (weight > 70) {
    warnings.push('Weight exceeds 70kg - consider palletizing')
  }
  
  return { isValid: true, warnings }
}
