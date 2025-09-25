"use client"

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { NearbyStore } from '@/hooks/use-google-maps'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Navigation, Star, Phone, Globe, Clock } from 'lucide-react'

// Declare global Google Maps types
declare global {
  interface Window {
    google: typeof google
    openDirections: (lat: number, lng: number) => void
    selectStore: (placeId: string) => void
  }
}

interface GoogleMapProps {
  center: { lat: number; lng: number }
  stores: NearbyStore[]
  onStoreSelect?: (store: NearbyStore) => void
  className?: string
  height?: string
}

export function GoogleMap({ center, stores, onStoreSelect, className, height = "400px" }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places', 'geometry'],
        })

        const google = await loader.load()
        
        if (!mapRef.current) return

        const mapInstance = new google.maps.Map(mapRef.current, {
          center,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        })

        setMap(mapInstance)
        setIsLoading(false)

        // Create info window
        infoWindowRef.current = new google.maps.InfoWindow()

        // Add user location marker
        new google.maps.Marker({
          position: center,
          map: mapInstance,
          title: 'Your Location',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#3b82f6',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        })

      } catch (error) {
        console.error('Error loading Google Maps:', error)
        setError('Failed to load Google Maps')
        setIsLoading(false)
      }
    }

    initializeMap()
  }, [center])

  useEffect(() => {
    if (!map || !window.google) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Add store markers
    stores.forEach((store, index) => {
      const marker = new google.maps.Marker({
        position: store.location,
        map,
        title: store.name,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: getMarkerColor(store.types),
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 1,
        },
      })

      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          const infoContent = `
            <div class="p-2 max-w-xs">
              <h3 class="font-semibold text-base mb-1">${store.name}</h3>
              <p class="text-sm text-gray-600 mb-2">${store.address}</p>
              <div class="flex items-center gap-2 mb-2">
                <span class="flex items-center gap-1 text-sm">
                  <svg class="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                  ${store.rating || 'N/A'}
                </span>
                <span class="text-sm text-gray-500">${store.distance}km away</span>
              </div>
              <div class="flex gap-2">
                <button onclick="window.openDirections(${store.location.lat}, ${store.location.lng})" 
                        class="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                  Get Directions
                </button>
                ${onStoreSelect ? `
                  <button onclick="window.selectStore('${store.placeId}')" 
                          class="text-xs bg-green-500 text-white px-2 py-1 rounded">
                    Select Store
                  </button>
                ` : ''}
              </div>
            </div>
          `
          
          infoWindowRef.current.setContent(infoContent)
          infoWindowRef.current.open(map, marker)
        }

        if (onStoreSelect) {
          onStoreSelect(store)
        }
      })

      markersRef.current.push(marker)
    })

    // Global functions for info window buttons
    ;(window as any).openDirections = (lat: number, lng: number) => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
      window.open(url, '_blank')
    }

    ;(window as any).selectStore = (placeId: string) => {
      const store = stores.find(s => s.placeId === placeId)
      if (store && onStoreSelect) {
        onStoreSelect(store)
      }
    }

    // Fit map to show all markers
    if (stores.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      bounds.extend(center)
      stores.forEach(store => bounds.extend(store.location))
      map.fitBounds(bounds)
      
      // Don't zoom in too much for single locations
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() && map.getZoom()! > 16) map.setZoom(16)
        google.maps.event.removeListener(listener)
      })
    }

  }, [map, stores, center, onStoreSelect])

  const getMarkerColor = (types: string[]): string => {
    if (types.some(type => type.includes('food') || type.includes('grocery') || type.includes('supermarket'))) {
      return '#22c55e' // Green for food
    }
    if (types.some(type => type.includes('pharmacy') || type.includes('health'))) {
      return '#3b82f6' // Blue for health
    }
    if (types.some(type => type.includes('electronics') || type.includes('store'))) {
      return '#f59e0b' // Orange for electronics/general
    }
    return '#6b7280' // Gray for others
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-0 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        <div 
          ref={mapRef} 
          style={{ height }} 
          className="w-full rounded-lg"
        />
        {stores.length > 0 && (
          <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm rounded-lg p-2">
            <p className="text-xs text-muted-foreground">
              Found {stores.length} store{stores.length !== 1 ? 's' : ''} nearby
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
