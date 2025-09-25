import { useState, useEffect } from 'react'

export interface NearbyStore {
  placeId: string
  name: string
  address: string
  rating: number
  isOpen: boolean | null
  distance: number
  location: {
    lat: number
    lng: number
  }
  types: string[]
  priceLevel: number | null
  photoReference: string | null
}

export interface LocationData {
  userLocation: {
    lat: number
    lng: number
  }
  nearbyStores: NearbyStore[]
}

export interface PlaceDetails {
  name: string
  formatted_address: string
  formatted_phone_number?: string
  opening_hours?: {
    open_now: boolean
    weekday_text: string[]
  }
  website?: string
  rating?: number
  reviews?: Array<{
    author_name: string
    rating: number
    text: string
    time: number
  }>
}

export function useGoogleMaps() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locationData, setLocationData] = useState<LocationData | null>(null)

  const findNearbyStores = async (address: string, rewardType: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, rewardType }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch location data')
      }

      const data: LocationData = await response.json()
      setLocationData(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getPlaceDetails = async (placeId: string): Promise<PlaceDetails> => {
    const response = await fetch(`/api/locations?placeId=${placeId}`)
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch place details')
    }

    return response.json()
  }

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location'
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out'
              break
          }
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      )
    })
  }

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // Using a simple reverse geocoding service for address lookup
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      )
      
      if (!response.ok) {
        throw new Error('Failed to get address from coordinates')
      }
      
      const data = await response.json()
      return data.displayName || `${lat}, ${lng}`
    } catch (err) {
      console.warn('Reverse geocoding failed:', err)
      return `${lat}, ${lng}`
    }
  }

  return {
    isLoading,
    error,
    locationData,
    findNearbyStores,
    getPlaceDetails,
    getCurrentLocation,
    reverseGeocode,
  }
}
