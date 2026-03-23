export interface AIWeightSuggestion {
  estimatedWeight: number
  weightRange: { min: number; max: number }
  confidence: number
  reasoning: string
  packageTypeSuggestion: string
  flags: string[]
}

export interface AIDimensionSuggestion {
  estimatedDimensions: { length: number; width: number; height: number }
  volumeWeight: number
  reasoning: string
}

const ITEM_DATABASE: Record<string, { avgWeight: number; weightRange: [number, number]; typicalDimensions: [number, number, number]; packageType: string }> = {
  laptop: { avgWeight: 2.5, weightRange: [1.5, 4], typicalDimensions: [40, 30, 8], packageType: 'parcel' },
  phone: { avgWeight: 0.2, weightRange: [0.1, 0.4], typicalDimensions: [18, 9, 2], packageType: 'parcel' },
  tablet: { avgWeight: 0.6, weightRange: [0.4, 1], typicalDimensions: [25, 18, 1], packageType: 'parcel' },
  clothing: { avgWeight: 0.8, weightRange: [0.3, 2], typicalDimensions: [40, 30, 5], packageType: 'parcel' },
  shoes: { avgWeight: 1.2, weightRange: [0.5, 2.5], typicalDimensions: [35, 25, 15], packageType: 'parcel' },
  documents: { avgWeight: 0.3, weightRange: [0.1, 1], typicalDimensions: [30, 21, 2], packageType: 'document' },
  book: { avgWeight: 0.5, weightRange: [0.2, 2], typicalDimensions: [25, 18, 3], packageType: 'document' },
  electronics: { avgWeight: 1.5, weightRange: [0.5, 5], typicalDimensions: [30, 25, 10], packageType: 'parcel' },
  cosmetics: { avgWeight: 0.5, weightRange: [0.2, 1.5], typicalDimensions: [20, 15, 10], packageType: 'parcel' },
  food: { avgWeight: 1, weightRange: [0.3, 3], typicalDimensions: [25, 20, 15], packageType: 'parcel' },
  medicine: { avgWeight: 0.3, weightRange: [0.1, 1], typicalDimensions: [15, 10, 8], packageType: 'parcel' },
  toy: { avgWeight: 0.8, weightRange: [0.2, 3], typicalDimensions: [30, 20, 15], packageType: 'parcel' },
  watch: { avgWeight: 0.2, weightRange: [0.1, 0.5], typicalDimensions: [15, 12, 5], packageType: 'parcel' },
  jewelry: { avgWeight: 0.1, weightRange: [0.05, 0.3], typicalDimensions: [10, 10, 5], packageType: 'document' },
  'laptop charger': { avgWeight: 0.5, weightRange: [0.3, 0.8], typicalDimensions: [15, 8, 5], packageType: 'parcel' },
  headphones: { avgWeight: 0.3, weightRange: [0.2, 0.6], typicalDimensions: [20, 18, 8], packageType: 'parcel' },
  camera: { avgWeight: 0.8, weightRange: [0.4, 2], typicalDimensions: [15, 12, 10], packageType: 'parcel' },
  fragile: { avgWeight: 1, weightRange: [0.3, 4], typicalDimensions: [30, 25, 20], packageType: 'fragile' },
  cargo: { avgWeight: 10, weightRange: [5, 50], typicalDimensions: [60, 40, 40], packageType: 'cargo' },
  pallet: { avgWeight: 100, weightRange: [50, 500], typicalDimensions: [120, 80, 100], packageType: 'cargo' },
}

export function getAIWeightSuggestion(description: string, declaredWeight?: number): AIWeightSuggestion | null {
  if (!description || description.length < 2) return null
  
  const lowerDesc = description.toLowerCase()
  
  let matchedItem: string | null = null
  for (const item of Object.keys(ITEM_DATABASE)) {
    if (lowerDesc.includes(item)) {
      matchedItem = item
      break
    }
  }
  
  if (!matchedItem) {
    const wordCount = description.split(' ').length
    if (wordCount < 2) return null
    
    return {
      estimatedWeight: 1,
      weightRange: { min: 0.5, max: 3 },
      confidence: 40,
      reasoning: `Generic description detected. Based on typical package sizes, estimated weight range provided.`,
      packageTypeSuggestion: 'parcel',
      flags: ['Consider specifying item type for more accurate estimate'],
    }
  }
  
  const item = ITEM_DATABASE[matchedItem]
  const weightMultiplier = lowerDesc.includes('multiple') || lowerDesc.includes('set') || lowerDesc.includes('pack') ? 2 : 1
  const estimatedWeight = item.avgWeight * weightMultiplier
  const minWeight = item.weightRange[0] * weightMultiplier
  const maxWeight = item.weightRange[1] * weightMultiplier
  
  const flags: string[] = []
  
  if (declaredWeight) {
    const ratio = declaredWeight / estimatedWeight
    if (ratio < 0.3) {
      flags.push(`Declared weight (${declaredWeight}kg) seems unusually low for ${matchedItem}`)
    } else if (ratio > 3) {
      flags.push(`Declared weight (${declaredWeight}kg) seems unusually high for ${matchedItem}`)
    }
  }
  
  return {
    estimatedWeight: Math.round(estimatedWeight * 100) / 100,
    weightRange: { min: Math.round(minWeight * 100) / 100, max: Math.round(maxWeight * 100) / 100 },
    confidence: matchedItem === 'fragile' || matchedItem === 'cargo' ? 85 : 90,
    reasoning: `Detected "${matchedItem}" in description. Based on typical ${matchedItem} shipments.`,
    packageTypeSuggestion: item.packageType,
    flags,
  }
}

export function getAIDimensionSuggestion(description: string): AIDimensionSuggestion | null {
  if (!description || description.length < 2) return null
  
  const lowerDesc = description.toLowerCase()
  
  let matchedItem: string | null = null
  for (const item of Object.keys(ITEM_DATABASE)) {
    if (lowerDesc.includes(item)) {
      matchedItem = item
      break
    }
  }
  
  if (!matchedItem) {
    return null
  }
  
  const item = ITEM_DATABASE[matchedItem]
  const [l, w, h] = item.typicalDimensions
  
  const volumeWeight = (l * w * h) / 5000
  
  return {
    estimatedDimensions: { length: l, width: w, height: h },
    volumeWeight: Math.round(volumeWeight * 100) / 100,
    reasoning: `Typical dimensions for ${matchedItem}: ${l}x${w}x${h}cm. Volume weight: ${volumeWeight.toFixed(2)}kg at divisor 5000.`,
  }
}

export function validateWeightDimensions(weight: number, length?: number, width?: number, height?: number): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = []
  
  if (!length || !width || !height) {
    return { isValid: true, warnings: ['Consider adding dimensions for accurate volumetric pricing'] }
  }
  
  const volumetricWeight = (length * width * height) / 5000
  const ratio = weight / volumetricWeight
  
  if (ratio < 0.3) {
    warnings.push(`Volumetric weight (${volumetricWeight.toFixed(2)}kg) significantly exceeds actual weight. Package may be under-declared.`)
  } else if (ratio > 5) {
    warnings.push(`Actual weight significantly exceeds volumetric weight. Consider verifying dimensions.`)
  }
  
  if (length > 200 || width > 200 || height > 200) {
    warnings.push(`One or more dimensions exceed 200cm. May require special handling or freight shipping.`)
  }
  
  if (weight > 70) {
    warnings.push(`Weight exceeds 70kg. May require palletizing or freight service.`)
  }
  
  return { isValid: true, warnings }
}
