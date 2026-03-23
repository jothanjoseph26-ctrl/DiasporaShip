"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Search, X, Loader2 } from "lucide-react";
import { useGoogleMaps, AddressResult } from "@/hooks/useGoogleMaps";

interface AddressInputProps {
  value: string;
  onChange: (address: string) => void;
  onSelect: (result: AddressResult) => void;
  placeholder?: string;
  label?: string;
  country?: string | string[];
  types?: string[];
  className?: string;
}

declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps: () => void;
  }
}

export function AddressInput({
  value,
  onChange,
  onSelect,
  placeholder = "Enter an address...",
  label,
  country,
  types = ["address"],
  className = "",
}: AddressInputProps) {
  const { isReady, getPlaceDetails, parseAddressComponents } = useGoogleMaps();
  const [isOpen, setIsOpen] = useState(false);
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<AddressResult | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isReady || !inputRef.current) return;

    if (!serviceRef.current && window.google?.maps?.places) {
      serviceRef.current = new window.google.maps.places.AutocompleteService();
    }

    if (
      !autocompleteRef.current &&
      window.google?.maps?.places &&
      inputRef.current
    ) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types,
          componentRestrictions: country
            ? { country: Array.isArray(country) ? country : [country] }
            : undefined,
          fields: ["address_components", "formatted_address", "geometry", "name", "place_id"],
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.place_id) {
          handlePlaceSelect(place as google.maps.places.PlaceResult);
        }
      });
    }
  }, [isReady, country, types]);

  const handlePlaceSelect = useCallback(
    async (place: google.maps.places.PlaceResult) => {
      if (!place.geometry?.location) return;

      const parsed = parseAddressComponents(place.address_components || []);
      const result: AddressResult = {
        address: parsed.address || place.formatted_address || "",
        city: parsed.city || "",
        state: parsed.state || "",
        zip: parsed.zip || "",
        country: parsed.country || "",
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        placeId: place.place_id || "",
      };

      setSelectedResult(result);
      onChange(place.formatted_address || place.name || "");
      onSelect(result);
      setIsOpen(false);
      setPredictions([]);
    },
    [onChange, onSelect, parseAddressComponents]
  );

  const fetchPredictions = useCallback(
    (input: string) => {
      if (!serviceRef.current || input.length < 3) {
        setPredictions([]);
        return;
      }

      serviceRef.current.getPlacePredictions(
        {
          input,
          componentRestrictions: country
            ? { country: Array.isArray(country) ? country : [country] }
            : undefined,
          types,
        },
        (results, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            results
          ) {
            setPredictions(results);
            setIsOpen(true);
          } else {
            setPredictions([]);
          }
        }
      );
    },
    [country, types]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    onChange(input);
    setSelectedResult(null);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchPredictions(input);
    }, 300);
  };

  const handlePredictionClick = async (
    prediction: google.maps.places.AutocompletePrediction
  ) => {
    setIsLoading(true);
    const place = await getPlaceDetails(prediction.place_id);
    if (place) {
      handlePlaceSelect(place);
    }
    setIsLoading(false);
  };

  const clearAddress = () => {
    onChange("");
    setSelectedResult(null);
    setPredictions([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-[var(--ink)] mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]">
          <Search className="w-4 h-4" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => predictions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full h-11 pl-10 pr-10 rounded-lg border border-[var(--border-warm)] bg-white text-[var(--ink)] placeholder:text-[var(--muted-text)] focus:outline-none focus:ring-2 focus:ring-[var(--terra)] focus:border-transparent transition-shadow"
          autoComplete="off"
        />

        {value && (
          <button
            type="button"
            onClick={clearAddress}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)] hover:text-[var(--ink)]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {isOpen && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg border border-[var(--border-warm)] shadow-lg max-h-64 overflow-y-auto">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              type="button"
              onClick={() => handlePredictionClick(prediction)}
              className="w-full px-4 py-3 text-left hover:bg-[var(--cream)] flex items-start gap-3 transition-colors"
            >
              <MapPin className="w-4 h-4 text-[var(--terra)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[var(--ink)]">
                  {prediction.structured_formatting.main_text}
                </p>
                <p className="text-xs text-[var(--muted-text)]">
                  {prediction.structured_formatting.secondary_text}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedResult && (
        <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
          <MapPin className="w-4 h-4" />
          <span>Location selected</span>
        </div>
      )}
    </div>
  );
}

interface AddressMapProps {
  address: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  height?: string;
}

export function AddressMap({
  address,
  lat,
  lng,
  zoom = 15,
  height = "200px",
}: AddressMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const { isReady } = useGoogleMaps();

  useEffect(() => {
    if (!isReady || !mapRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: lat || 0, lng: lng || 0 },
        zoom,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ saturation: -20 }],
          },
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });
    }

    if (lat && lng) {
      const position = { lat, lng };
      mapInstanceRef.current.setCenter(position);

      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      markerRef.current = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#C4622D",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });
    }
  }, [isReady, lat, lng, zoom]);

  if (!address && !lat) {
    return (
      <div
        className="rounded-xl border border-[var(--border-warm)] flex items-center justify-center bg-[var(--cream)]"
        style={{ height }}
      >
        <p className="text-sm text-[var(--muted-text)]">
          Enter an address to see the location
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-[var(--border-warm)]">
      <div
        ref={mapRef}
        style={{ height, width: "100%" }}
        className="w-full"
      />
      {address && (
        <div className="p-3 bg-[var(--cream)] border-t border-[var(--border-warm)]">
          <p className="text-sm text-[var(--ink)] truncate">{address}</p>
        </div>
      )}
    </div>
  );
}
