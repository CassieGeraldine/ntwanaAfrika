"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

export default function DebugMaps() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testAPI = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log('Testing Google Maps API...')
      
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: 'Johannesburg, South Africa',
          rewardType: 'food'
        }),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      setResult(data)
    } catch (err) {
      console.error('API Test Error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const checkEnvironment = () => {
    console.log('Environment check:')
    console.log('- NODE_ENV:', process.env.NODE_ENV)
    console.log('- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY exists:', !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
    console.log('- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY length:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.length || 0)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🗺️ Google Maps API Debug Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={testAPI} disabled={loading}>
                {loading ? 'Testing...' : 'Test API'}
              </Button>
              <Button onClick={checkEnvironment} variant="outline">
                Check Environment
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  <strong>Error:</strong> {error}
                </AlertDescription>
              </Alert>
            )}

            {result && (
              <div className="space-y-4">
                <Alert>
                  <AlertDescription>
                    <strong>Success!</strong> Found {result.nearbyStores?.length || 0} stores
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">API Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>User Location:</strong> 
                        {result.userLocation && ` ${result.userLocation.lat}, ${result.userLocation.lng}`}
                      </div>
                      <div>
                        <strong>Stores Found:</strong> {result.nearbyStores?.length || 0}
                      </div>
                    </div>

                    {result.nearbyStores?.slice(0, 3).map((store: any, index: number) => (
                      <div key={index} className="mt-4 p-3 border rounded-lg">
                        <div className="font-medium">{store.name}</div>
                        <div className="text-sm text-muted-foreground">{store.address}</div>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{store.distance}km</Badge>
                          {store.rating > 0 && <Badge variant="secondary">★ {store.rating}</Badge>}
                        </div>
                      </div>
                    ))}

                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm font-medium">Raw JSON Response</summary>
                      <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </details>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Environment Variables Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:</span>
                <Badge variant={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? "default" : "destructive"}>
                  {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 
                    `Set (${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.length} chars)` : 
                    'Not Set'
                  }
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Environment:</span>
                <Badge variant="outline">{process.env.NODE_ENV}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <strong>1. Get Google Maps API Key:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Go to <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-600 underline">Google Cloud Console</a></li>
                <li>• Enable Maps JavaScript API, Places API, Geocoding API</li>
                <li>• Create an API key</li>
              </ul>
            </div>
            <div>
              <strong>2. Update .env.local:</strong>
              <pre className="mt-1 p-2 bg-muted rounded text-xs">
{`GOOGLE_MAPS_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here`}
              </pre>
            </div>
            <div>
              <strong>3. Restart development server:</strong>
              <pre className="mt-1 p-2 bg-muted rounded text-xs">npm run dev</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
