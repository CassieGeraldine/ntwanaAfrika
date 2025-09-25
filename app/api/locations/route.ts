import { NextResponse } from "next/server"
import { Client } from "@googlemaps/google-maps-services-js"

// Initialize Google Maps client
const client = new Client({})

export async function POST(req: Request) {
  try {
    const { address, rewardType } = await req.json()
    
    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: "Missing GOOGLE_MAPS_API_KEY in environment variables",
          details: "Please add your Google Maps API key to .env.local file",
          setup: "Go to https://console.cloud.google.com/ to get an API key"
        },
        { status: 500 }
      )
    }

    if (apiKey.includes("your_") || apiKey === "your_google_maps_api_key_here") {
      return NextResponse.json(
        { 
          error: "Invalid Google Maps API key - still using placeholder value",
          details: "Please replace 'your_google_maps_api_key_here' with your actual API key in .env.local",
          setup: "Get your API key from https://console.cloud.google.com/"
        },
        { status: 500 }
      )
    }

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      )
    }

    // Geocode the user's address to get coordinates
    const geocodeResponse = await client.geocode({
      params: {
        address: address,
        key: apiKey,
        region: 'za', // Prioritize South African results
      }
    })

    if (geocodeResponse.data.results.length === 0) {
      return NextResponse.json(
        { error: "Could not find location for the provided address" },
        { status: 404 }
      )
    }

    const userLocation = geocodeResponse.data.results[0].geometry.location

    // Search for nearby places based on reward type
    let searchQuery = ""
    switch (rewardType) {
      case "food":
        searchQuery = "grocery store OR supermarket OR food store"
        break
      case "hygiene":
        searchQuery = "pharmacy OR health store OR convenience store"
        break
      case "connectivity":
        searchQuery = "mobile store OR telecommunication OR airtime vendor"
        break
      default:
        searchQuery = "store OR shop OR market"
    }

    // Find nearby places
    const placesResponse = await client.placesNearby({
      params: {
        location: userLocation,
        radius: 5000, // 5km radius
        keyword: searchQuery,
        key: apiKey,
      }
    })

    // Format the response
    const nearbyStores = placesResponse.data.results.slice(0, 10).map(place => ({
      placeId: place.place_id,
      name: place.name,
      address: place.vicinity,
      rating: place.rating || 0,
      isOpen: place.opening_hours?.open_now || null,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        place.geometry?.location.lat || 0,
        place.geometry?.location.lng || 0
      ),
      location: {
        lat: place.geometry?.location.lat || 0,
        lng: place.geometry?.location.lng || 0
      },
      types: place.types,
      priceLevel: place.price_level || null,
      photoReference: place.photos?.[0]?.photo_reference || null
    }))

    return NextResponse.json({
      userLocation,
      nearbyStores: nearbyStores.sort((a, b) => a.distance - b.distance)
    })

  } catch (error) {
    console.error("Google Maps API error:", error)
    
    let errorMessage = "Failed to fetch location data"
    let errorDetails = ""
    
    if (error instanceof Error) {
      errorMessage = error.message
      
      if (error.message.includes("API key")) {
        errorDetails = "Check your Google Maps API key in .env.local"
      } else if (error.message.includes("quota")) {
        errorDetails = "API quota exceeded. Check your Google Cloud Console billing."
      } else if (error.message.includes("permission")) {
        errorDetails = "API not enabled. Enable Maps JavaScript API, Places API, and Geocoding API in Google Cloud Console."
      } else if (error.message.includes("network")) {
        errorDetails = "Network connectivity issue. Check your internet connection."
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in kilometers
  return Math.round(distance * 100) / 100 // Round to 2 decimal places
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const placeId = searchParams.get('placeId')
  
  if (!placeId) {
    return NextResponse.json({ error: "Place ID is required" }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GOOGLE_MAPS_API_KEY in environment variables" },
      { status: 500 }
    )
  }

  try {
    // Get detailed information about a specific place
    const placeDetailsResponse = await client.placeDetails({
      params: {
        place_id: placeId,
        fields: ['name', 'formatted_address', 'formatted_phone_number', 'opening_hours', 'website', 'rating', 'reviews'],
        key: apiKey,
      }
    })

    return NextResponse.json(placeDetailsResponse.data.result)
  } catch (error) {
    console.error("Place details error:", error)
    return NextResponse.json(
      { error: "Failed to fetch place details" },
      { status: 500 }
    )
  }
}
