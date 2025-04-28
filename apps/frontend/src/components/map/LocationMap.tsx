"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Search } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

interface LocationMapProps {
  initialLat: number
  initialLng: number
  onLocationSelect: (lat: number, lng: number, address: string) => void
}

export default function LocationMap({ initialLat, initialLng, onLocationSelect }: LocationMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Initialize the map
    if (!mapRef.current) {
      // Create map instance
      mapRef.current = L.map(mapContainerRef.current).setView([initialLat, initialLng], 13)

      // Add tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)

      // Add marker at initial position
      markerRef.current = L.marker([initialLat, initialLng], {
        draggable: true,
      }).addTo(mapRef.current)

      // Handle marker drag events
      markerRef.current.on("dragend", () => {
        if (markerRef.current) {
          const position = markerRef.current.getLatLng()
          reverseGeocode(position.lat, position.lng)
        }
      })

      // Handle map click events
      mapRef.current.on("click", (e) => {
        const { lat, lng } = e.latlng
        if (markerRef.current && mapRef.current) {
          markerRef.current.setLatLng([lat, lng])
          reverseGeocode(lat, lng)
        }
      })
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
  }, [initialLat, initialLng])

  // Function to search for a location
  const searchLocation = async () => {
    if (!searchQuery.trim()) return

    try {
      // Using Nominatim for geocoding (OpenStreetMap's geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
      )

      const data = await response.json()

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0]
        const latitude = Number.parseFloat(lat)
        const longitude = Number.parseFloat(lon)

        // Update map and marker
        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([latitude, longitude], 13)
          markerRef.current.setLatLng([latitude, longitude])

          // Call the callback with the new location
          onLocationSelect(latitude, longitude, display_name)
        }
      }
    } catch (error) {
      console.error("Error searching for location:", error)
    }
  }

  // Function to get address from coordinates
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)

      const data = await response.json()

      if (data && data.display_name) {
        onLocationSelect(lat, lng, data.display_name)
      } else {
        onLocationSelect(lat, lng, "")
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error)
      onLocationSelect(lat, lng, "")
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Search for a location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchLocation()}
        />
        <Button type="button" onClick={searchLocation} variant="outline">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <div ref={mapContainerRef} className="h-[400px] w-full rounded-md border border-input overflow-hidden" />
    </div>
  )
}
