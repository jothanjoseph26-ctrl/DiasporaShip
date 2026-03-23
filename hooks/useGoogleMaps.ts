"use client";

import { useEffect, useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps: () => void;
  }
}

let isLoaded = false;
let loadPromise: Promise<void> | null = null;

export interface AddressResult {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  lat: number;
  lng: number;
  placeId: string;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function useGoogleMaps() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded) {
      setIsReady(true);
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setError("Google Maps API key not configured");
      console.warn("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set");
      return;
    }

    const loadGoogleMaps = async () => {
      try {
        await loadScript(
          `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`
        );

        window.initGoogleMaps = () => {
          isLoaded = true;
          setIsReady(true);
        };

        setTimeout(() => {
          if (!isLoaded) {
            window.initGoogleMaps?.();
          }
        }, 100);
      } catch (err) {
        setError("Failed to load Google Maps");
        console.error("Google Maps load error:", err);
      }
    };

    loadGoogleMaps();
  }, []);

  const getPlaceDetails = useCallback(
    (
      placeId: string
    ): Promise<google.maps.places.PlaceResult | null> => {
      return new Promise((resolve) => {
        if (!window.google?.maps?.places) {
          resolve(null);
          return;
        }

        const service = new window.google.maps.places.PlacesService(
          document.createElement("div")
        );

        service.getDetails(
          {
            placeId,
            fields: ["address_components", "formatted_address", "geometry", "name"],
          },
          (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
              resolve(place);
            } else {
              resolve(null);
            }
          }
        );
      });
    },
    []
  );

  const parseAddressComponents = useCallback(
    (components: google.maps.GeocoderAddressComponent[]): Partial<AddressResult> => {
      const result: Partial<AddressResult> = {};

      for (const component of components) {
        const types = component.types;

        if (types.includes("street_number")) {
          result.address = component.long_name + " " + (result.address || "");
        }
        if (types.includes("route")) {
          result.address = (result.address || "") + component.long_name;
        }
        if (types.includes("locality")) {
          result.city = component.long_name;
        }
        if (types.includes("administrative_area_level_1")) {
          result.state = component.long_name;
        }
        if (types.includes("postal_code")) {
          result.zip = component.long_name;
        }
        if (types.includes("country")) {
          result.country = component.short_name;
        }
      }

      return result;
    },
    []
  );

  return { isReady, error, getPlaceDetails, parseAddressComponents };
}
