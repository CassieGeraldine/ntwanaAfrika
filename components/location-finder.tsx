"use client"

import { useState } from 'react'
import { useGoogleMaps, type NearbyStore } from '@/hooks/use-google-maps'
import { GoogleMap } from '@/components/google-map'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  MapPin, 
  Navigation, 
  Star, 
  Phone, 
  Globe, 
  Clock, 
  Search,
  Locate,
  Store,
  AlertCircle,
  ExternalLink
} from 'lucide-react'

interface LocationFinderProps {
  rewardType: 'food' | 'hygiene' | 'connectivity'
  rewardItem?: {
    name: string
    cost: number
    description: string
  }
  onStoreSelect?: (store: NearbyStore) => void
}

export function LocationFinder({ rewardType, rewardItem, onStoreSelect }: LocationFinderProps) {
  const [address, setAddress] = useState('')
  const [selectedStore, setSelectedStore] = useState<NearbyStore | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const { isLoading, error, locationData, findNearbyStores, getCurrentLocation, reverseGeocode } = useGoogleMaps()

  const getRewardTypeDisplay = (type: string) => {
    switch (type) {
      case 'food':
        return { label: 'Food Stores', color: 'bg-green-500', icon: '🍞' }
      case 'hygiene':
        return { label: 'Health & Hygiene', color: 'bg-blue-500', icon: '🧼' }
      case 'connectivity':
        return { label: 'Airtime & Data', color: 'bg-orange-500', icon: '📱' }
      default:
        return { label: 'Stores', color: 'bg-gray-500', icon: '🏪' }
    }
  }

  const handleSearch = async () => {
    if (!address.trim()) return
    
    try {
      await findNearbyStores(address, rewardType)
    } catch (err) {
      console.error('Search failed:', err)
    }
  }

  const handleUseCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation()
      const addressFromCoords = await reverseGeocode(location.lat, location.lng)
      setAddress(addressFromCoords)
      await findNearbyStores(addressFromCoords, rewardType)
    } catch (err) {
      console.error('Location access failed:', err)
    }
  }

  const handleStoreSelect = (store: NearbyStore) => {
    setSelectedStore(store)
    setShowDetails(true)
    onStoreSelect?.(store)
  }

  const openDirections = (store: NearbyStore) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.location.lat},${store.location.lng}&destination_place_id=${store.placeId}`
    window.open(url, '_blank')
  }

  const rewardDisplay = getRewardTypeDisplay(rewardType)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">{rewardDisplay.icon}</span>
          <Badge className={`${rewardDisplay.color} text-white`}>
            {rewardDisplay.label}
          </Badge>
        </div>
        <h2 className="text-2xl font-bold">Find Nearby Stores</h2>
        {rewardItem && (
          <p className="text-muted-foreground mt-1">
            Redeem your {rewardItem.cost} Skill Coins for <strong>{rewardItem.name}</strong>
          </p>
        )}
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Stores Near You
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter your address, street name, or area..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading || !address.trim()}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              onClick={handleUseCurrentLocation}
              disabled={isLoading}
              className="gap-2"
            >
              <Locate className="h-4 w-4" />
              Use Current Location
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {locationData && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Store List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Store className="h-5 w-5" />
              Nearby Stores ({locationData.nearbyStores.length})
            </h3>
            
            {locationData.nearbyStores.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Store className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No stores found in this area. Try searching in a different location.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {locationData.nearbyStores.map((store) => (
                  <Card 
                    key={store.placeId} 
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleStoreSelect(store)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm">{store.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {store.distance}km
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2">{store.address}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {store.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{store.rating}</span>
                            </div>
                          )}
                          {store.isOpen !== null && (
                            <Badge 
                              variant={store.isOpen ? "default" : "secondary"}
                              className="text-xs px-2 py-0"
                            >
                              {store.isOpen ? "Open" : "Closed"}
                            </Badge>
                          )}
                        </div>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            openDirections(store)
                          }}
                        >
                          <Navigation className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5" />
              Map View
            </h3>
            <GoogleMap
              center={locationData.userLocation}
              stores={locationData.nearbyStores}
              onStoreSelect={handleStoreSelect}
              height="400px"
            />
          </div>
        </div>
      )}

      {/* Store Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Store Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedStore && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{selectedStore.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedStore.address}</p>
              </div>
              
              <div className="flex items-center gap-4">
                {selectedStore.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{selectedStore.rating}</span>
                  </div>
                )}
                <Badge variant="outline">
                  {selectedStore.distance}km away
                </Badge>
                {selectedStore.isOpen !== null && (
                  <Badge variant={selectedStore.isOpen ? "default" : "secondary"}>
                    {selectedStore.isOpen ? "Open Now" : "Currently Closed"}
                  </Badge>
                )}
              </div>

              {rewardItem && (
                <div className="p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm font-medium">Ready to Redeem:</p>
                  <p className="text-sm text-muted-foreground">
                    {rewardItem.name} for {rewardItem.cost} Skill Coins
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={() => openDirections(selectedStore)}
                  className="flex-1 gap-2"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </Button>
                {onStoreSelect && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      onStoreSelect(selectedStore)
                      setShowDetails(false)
                    }}
                  >
                    Select This Store
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
