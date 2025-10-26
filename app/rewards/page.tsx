"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { LocationFinder } from "@/components/location-finder"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Coins, Gift, Smartphone, Utensils, Droplets, Star, Clock, CheckCircle, Copy, ExternalLink, MapPin } from "lucide-react"
import type { NearbyStore } from "@/hooks/use-google-maps"
import { ProtectedRoute } from "@/components/protected-route"
import { useUserData } from "@/hooks/use-user-data"

const voucherCategories = [
  {
    id: "food",
    name: "Food & Nutrition",
    icon: Utensils,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    items: [
      {
        id: 1,
        name: "Bread Loaf",
        description: "Fresh whole wheat bread from local bakery",
        cost: 150,
        image: "/rustic-bread-loaf.png",
        availability: "Available",
        partner: "Ubuntu Bakery",
      },
      {
        id: 2,
        name: "Maize Meal (2kg)",
        description: "High-quality maize meal for family meals",
        cost: 300,
        image: "/maize-meal-bag.jpg",
        availability: "Available",
        partner: "Community Store",
      },
      {
        id: 3,
        name: "Rice (1kg)",
        description: "Premium white rice for nutritious meals",
        cost: 250,
        image: "/rice-bag.png",
        availability: "Limited",
        partner: "Local Market",
      },
    ],
  },
  {
    id: "hygiene",
    name: "Hygiene & Health",
    icon: Droplets,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    items: [
      {
        id: 4,
        name: "Soap Bar",
        description: "Antibacterial soap for daily hygiene",
        cost: 80,
        image: "/soap-bar.png",
        availability: "Available",
        partner: "Health Plus",
      },
      {
        id: 5,
        name: "Toothpaste",
        description: "Fluoride toothpaste for dental health",
        cost: 120,
        image: "/toothpaste-tube.png",
        availability: "Available",
        partner: "Care Pharmacy",
      },
      {
        id: 6,
        name: "Shampoo",
        description: "Gentle shampoo for healthy hair",
        cost: 180,
        image: "/shampoo-bottle.png",
        availability: "Available",
        partner: "Beauty Store",
      },
    ],
  },
  {
    id: "connectivity",
    name: "Airtime & Data",
    icon: Smartphone,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    items: [
      {
        id: 7,
        name: "Airtime R20",
        description: "Mobile airtime for calls and SMS",
        cost: 200,
        image: "/mobile-phone-airtime.jpg",
        availability: "Available",
        partner: "MTN",
      },
      {
        id: 8,
        name: "Data 1GB",
        description: "High-speed mobile data bundle",
        cost: 350,
        image: "/mobile-data-wifi.jpg",
        availability: "Available",
        partner: "Vodacom",
      },
      {
        id: 9,
        name: "Data 500MB",
        description: "Mobile data for essential browsing",
        cost: 200,
        image: "/mobile-data-bundle.png",
        availability: "Available",
        partner: "Cell C",
      },
    ],
  },
]

const recentRedemptions = [
  {
    id: 1,
    item: "Bread Loaf",
    cost: 150,
    date: "2 hours ago",
    status: "Ready for pickup",
    code: "BL2024001",
  },
  {
    id: 2,
    item: "Airtime R20",
    cost: 200,
    date: "1 day ago",
    status: "Redeemed",
    code: "AT2024002",
  },
  {
    id: 3,
    item: "Soap Bar",
    cost: 80,
    date: "3 days ago",
    status: "Redeemed",
    code: "SB2024003",
  },
]

export default function Rewards() {
  const [selectedCategory, setSelectedCategory] = useState("food")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showRedemptionDialog, setShowRedemptionDialog] = useState(false)
  const [showLocationFinder, setShowLocationFinder] = useState(false)
  const [selectedStore, setSelectedStore] = useState<NearbyStore | null>(null)
  const [redemptionCode, setRedemptionCode] = useState("")

  const { userProfile, redeemReward } = useUserData()

  if (!userProfile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    )
  }

  const milestones = [
    { coins: 500, reward: "Bronze Badge", achieved: userProfile.skillCoins >= 500 },
    { coins: 1000, reward: "Silver Badge", achieved: userProfile.skillCoins >= 1000 },
    { coins: 2500, reward: "Gold Badge", achieved: userProfile.skillCoins >= 2500, progress: (userProfile.skillCoins / 2500) * 100 },
    { coins: 5000, reward: "Platinum Badge", achieved: userProfile.skillCoins >= 5000, progress: (userProfile.skillCoins / 5000) * 100 },
  ]

  const handleRedeem = (item: any) => {
    if (userProfile.skillCoins >= item.cost) {
      setSelectedItem(item)
      setShowLocationFinder(true)
    }
  }

  const handleStoreSelect = (store: NearbyStore) => {
    setSelectedStore(store)
    setShowLocationFinder(false)
    
    // Generate mock redemption code
    const code = `${selectedItem?.name.substring(0, 2).toUpperCase()}${Date.now().toString().slice(-6)}`
    setRedemptionCode(code)
    setShowRedemptionDialog(true)
  }

  const handleLocationFinderClose = () => {
    setShowLocationFinder(false)
    setSelectedItem(null)
    setSelectedStore(null)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(redemptionCode)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="md:ml-64 pt-20 md:pt-0 pb-20 md:pb-0">
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Rewards Store</h1>
              <p className="text-muted-foreground">Exchange your Skill Coins for real rewards!</p>
            </div>

            {/* Coin Balance */}
            <Card className="mb-6 bg-gradient-to-r from-secondary/20 to-accent/20 border-secondary/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center">
                      <Coins className="h-8 w-8 text-secondary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{userProfile.skillCoins?.toLocaleString() ?? '0'} Skill Coins</h2>
                      <p className="text-muted-foreground">Available for redemption</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-accent">
                      <Star className="h-5 w-5" />
                      <span className="font-medium">+250 earned today</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Keep learning to earn more!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                {voucherCategories.map((category) => {
                  const Icon = category.icon
                  return (
                    <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{category.name}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {voucherCategories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.items.map((item) => {
                      const canAfford = userProfile.skillCoins >= item.cost
                      return (
                        <Card
                          key={item.id}
                          className={`hover:shadow-md transition-shadow ${!canAfford ? "opacity-60" : ""}`}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg">{item.name}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                              </div>
                              <Badge
                                variant={item.availability === "Available" ? "default" : "secondary"}
                                className={
                                  item.availability === "Available"
                                    ? "bg-accent text-accent-foreground"
                                    : "bg-secondary text-secondary-foreground"
                                }
                              >
                                {item.availability}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex justify-center">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded-lg border"
                              />
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Coins className="h-4 w-4 text-secondary" />
                                  <span className="font-bold text-lg">{item.cost}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">by {item.partner}</span>
                              </div>
                              <Button
                                onClick={() => handleRedeem(item)}
                                disabled={!canAfford || item.availability !== "Available"}
                                className="w-full"
                                variant={canAfford ? "default" : "outline"}
                              >
                                {!canAfford ? (
                                  <>
                                    <Coins className="h-4 w-4 mr-2" />
                                    Need {item.cost - userProfile.skillCoins} more coins
                                  </>
                                ) : (
                                  <>
                                    <Gift className="h-4 w-4 mr-2" />
                                    Redeem Now
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {/* Recent Redemptions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Redemptions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentRedemptions.map((redemption) => (
                    <div key={redemption.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{redemption.item}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{redemption.date}</span>
                          <span>Code: {redemption.code}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-secondary text-sm">
                          <Coins className="h-3 w-3" />
                          <span>{redemption.cost}</span>
                        </div>
                        <Badge
                          variant={redemption.status === "Ready for pickup" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {redemption.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-secondary" />
                    Coin Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{milestone.reward}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{milestone.coins} coins</span>
                          {milestone.achieved && <CheckCircle className="h-4 w-4 text-accent" />}
                        </div>
                      </div>
                      {!milestone.achieved && (
                        <div className="space-y-1">
                          <Progress value={milestone.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">{milestone.coins - userProfile.skillCoins} coins to go</p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Enhanced Redemption Dialog */}
        <Dialog open={showRedemptionDialog} onOpenChange={setShowRedemptionDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                Redemption Successful!
              </DialogTitle>
              <DialogDescription>
                Your voucher has been generated. Show this code to the partner store to claim your reward.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">{selectedItem?.name}</h3>
                <div className="text-3xl font-mono font-bold text-primary mb-2">{redemptionCode}</div>
                <p className="text-sm text-muted-foreground">Voucher Code</p>
              </div>

              {/* Store Information */}
              {selectedStore && (
                <div className="p-4 bg-accent/10 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Pickup Location
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{selectedStore.name}</p>
                    <p className="text-muted-foreground">{selectedStore.address}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {selectedStore.distance}km away
                      </Badge>
                      {selectedStore.isOpen !== null && (
                        <Badge variant={selectedStore.isOpen ? "default" : "secondary"} className="text-xs">
                          {selectedStore.isOpen ? "Open Now" : "Currently Closed"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Partner Store:</span>
                  <span className="font-medium">{selectedItem?.partner}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valid Until:</span>
                  <span className="font-medium">30 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Coins Used:</span>
                  <span className="font-medium">{selectedItem?.cost}</span>
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={copyCode} className="flex-1 bg-transparent">
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
              {selectedStore ? (
                <Button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedStore.location.lat},${selectedStore.location.lng}`, '_blank')}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              ) : (
                <Button onClick={() => setShowRedemptionDialog(false)} className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Find Store
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Location Finder Dialog */}
        <Dialog open={showLocationFinder} onOpenChange={handleLocationFinderClose}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Find Store Location
              </DialogTitle>
              <DialogDescription>
                Select a nearby store to redeem your {selectedItem?.name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedItem && (
              <LocationFinder
                rewardType={selectedCategory as 'food' | 'hygiene' | 'connectivity'}
                rewardItem={selectedItem}
                onStoreSelect={handleStoreSelect}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
