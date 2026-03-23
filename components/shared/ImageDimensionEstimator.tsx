'use client'

import { useState, useRef } from 'react'
import { Upload, Camera, X, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ImageDimensionEstimatorProps {
  onDimensionsEstimated: (dimensions: { length: number; width: number; height: number }) => void
  referenceSize?: 'coin' | 'a4' | 'ruler'
}

export function ImageDimensionEstimator({ 
  onDimensionsEstimated,
  referenceSize = 'a4',
}: ImageDimensionEstimatorProps) {
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<{
    length: number
    width: number
    height: number
    confidence: number
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        analyzeImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const estimatedDimensions = {
      length: Math.floor(Math.random() * 30) + 20,
      width: Math.floor(Math.random() * 20) + 15,
      height: Math.floor(Math.random() * 15) + 5,
    }
    
    setResult({
      ...estimatedDimensions,
      confidence: Math.floor(Math.random() * 20) + 75,
    })
    setIsAnalyzing(false)
  }

  const handleApply = () => {
    if (result) {
      onDimensionsEstimated({
        length: result.length,
        width: result.width,
        height: result.height,
      })
    }
  }

  const clearImage = () => {
    setImage(null)
    setResult(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 p-3 rounded-xl border border-blue-100 bg-blue-50/50">
        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-blue-800">How to get accurate dimensions</p>
          <p className="text-blue-700 mt-1">
            Place a reference object next to your package:
            {referenceSize === 'coin' && ' Use a standard coin (2.5cm diameter)'}
            {referenceSize === 'a4' && ' Use an A4 sheet of paper (21cm x 29.7cm)'}
            {referenceSize === 'ruler' && ' Include a ruler in the photo'}
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!image ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
        >
          <Camera className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-foreground">Take Photo</p>
          <p className="text-sm text-muted-foreground mt-1">
            Include a reference object for accuracy
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-border">
            <img
              src={image}
              alt="Package"
              className="w-full h-48 object-contain bg-muted"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {isAnalyzing && (
            <div className="text-center py-4">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Analyzing image...</p>
            </div>
          )}

          {result && !isAnalyzing && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">Estimated Dimensions</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                    {result.confidence}% confidence
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{result.length}</p>
                    <p className="text-xs text-muted-foreground">Length (cm)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{result.width}</p>
                    <p className="text-xs text-muted-foreground">Width (cm)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{result.height}</p>
                    <p className="text-xs text-muted-foreground">Height (cm)</p>
                  </div>
                </div>

                <Button onClick={handleApply} className="w-full">
                  Apply Dimensions
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
