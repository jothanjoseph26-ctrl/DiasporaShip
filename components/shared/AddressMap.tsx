'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Search } from 'lucide-react'

interface AddressMapProps {
  value?: { lat?: number; lng?: number }
  onChange: (address: { lat?: number; lng?: number; formattedAddress?: string }) => void
  placeholder?: string
}

export function AddressMap({ value, onChange, placeholder = 'Search for address...' }: AddressMapProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchValue, setSearchValue] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).google?.maps) {
      setIsLoaded(true)
    }
  }, [])

  const handleSearch = () => {
    if (!inputRef.current) return
    
    const geocoder = new (window as any).google.maps.Geocoder()
    geocoder.geocode({ address: searchValue }, (results: any[], status: string) => {
      if (status === 'OK' && results?.[0]) {
        const location = results[0].geometry.location
        onChange({
          lat: location.lat(),
          lng: location.lng(),
          formattedAddress: results[0].formatted_address,
        })
      }
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder={placeholder}
            className="pl-9"
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Search
        </button>
      </div>
      
      {value?.lat && value?.lng && (
        <div className="rounded-xl border border-border overflow-hidden h-48 bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MapPin className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Location selected</p>
            <p className="text-xs mt-1">
              {value.lat?.toFixed(4)}, {value.lng?.toFixed(4)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
