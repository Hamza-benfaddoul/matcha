"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { lazy, Suspense } from "react"
import useAuth from '@/hooks/useAuth'
import axios from 'axios'

// Lazy load the map component to improve initial load performance
const LocationMap = lazy(() => import("./LocationMap"))

export default function LocationPicker() {
  const [open, setOpen] = useState(false)
  const {auth, setAuth} = useAuth();
  const [location, setLocation] = useState({
    latitude: 40.7128,
    longitude: -74.006,
    address: "New York, NY, USA",
  })
  const [isUpdating, setIsUpdating] = useState(false)

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setLocation({
      latitude: lat,
      longitude: lng,
      address: address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    })
  }

  const updateUserLocation = async () => {
    setIsUpdating(true)

    try {
      // Make the API call to update the user's location using axios
      const response = await axios.post('/api/user/location/update', {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        userId: auth.user.id, // Replace with actual user ID
      })

      if (response.status !== 200) {
        throw new Error('Failed to update location')
      }

      console.log('Location updated successfully:', response.data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Close the modal after successful update
      setOpen(false)

      // Show success message (you might want to use a toast notification here)
      console.log("Location updated successfully")
    } catch (error) {
      console.error("Error updating location:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="flex items-center gap-2 hover:bg-slate-100 transition-colors"
      >
        <MapPin className="h-4 w-4" />
        Update Location
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Update Your Location</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Suspense
              fallback={
                <div className="h-[400px] w-full bg-gray-200 flex items-center justify-center">Loading map...</div>
              }
            >
              <LocationMap
                initialLat={location.latitude}
                initialLng={location.longitude}
                onLocationSelect={handleLocationSelect}
              />
            </Suspense>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location.address}
                onChange={(e) => setLocation({ ...location, address: e.target.value })}
                placeholder="Enter your location"
              />
              <p className="text-sm text-muted-foreground">
                Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateUserLocation} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Location"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
