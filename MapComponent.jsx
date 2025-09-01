import { useState, useEffect } from 'react'
import { MapPin, AlertTriangle, Navigation, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card.jsx'

const MapComponent = ({ spots, onSpotClick }) => {
  const [userLocation, setUserLocation] = useState(null)
  const [selectedSpot, setSelectedSpot] = useState(null)

  // Mock user location (in a real app, this would use geolocation API)
  useEffect(() => {
    setUserLocation({ lat: 32.0853, lng: 34.7818 }) // Tel Aviv coordinates
  }, [])

  // Mock no-fly zones data
  const noFlyZones = [
    { id: 1, name: "Ben Gurion Airport", lat: 32.0114, lng: 34.8867, radius: 2000 },
    { id: 2, name: "Military Base", lat: 32.1000, lng: 34.8000, radius: 1500 },
    { id: 3, name: "Restricted Area", lat: 32.0500, lng: 34.7500, radius: 1000 }
  ]

  const handleSpotClick = (spot) => {
    setSelectedSpot(spot)
    if (onSpotClick) {
      onSpotClick(spot)
    }
  }

  const getSpotIcon = (type) => {
    switch (type) {
      case 'Mountain': return '🏔️'
      case 'Coastal': return '🌊'
      case 'Urban': return '🏙️'
      case 'Forest': return '🌲'
      default: return '📍'
    }
  }

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-100 via-green-50 to-blue-50">
      {/* Map Container */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background Map Simulation */}
        <div className="w-full h-full relative">
          {/* Grid lines to simulate map */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#94a3b8" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* No-Fly Zones */}
          {noFlyZones.map((zone) => (
            <div
              key={zone.id}
              className="absolute bg-red-500/30 border-2 border-red-500 rounded-full flex items-center justify-center"
              style={{
                left: `${(zone.lng - 34.7) * 800 + 200}px`,
                top: `${(32.2 - zone.lat) * 600 + 100}px`,
                width: `${zone.radius / 20}px`,
                height: `${zone.radius / 20}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          ))}

          {/* Flying Spots */}
          {spots.map((spot) => (
            <div
              key={spot.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                left: `${(spot.coordinates.lng - 34.7) * 800 + 200}px`,
                top: `${(32.2 - spot.coordinates.lat) * 600 + 100}px`
              }}
              onClick={() => handleSpotClick(spot)}
            >
              <div className="bg-white rounded-full p-2 shadow-lg border-2 border-blue-500 hover:border-blue-600 transition-colors">
                <div className="text-lg">{getSpotIcon(spot.type)}</div>
              </div>
              {selectedSpot?.id === spot.id && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-20">
                  <Card className="w-64 shadow-lg">
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm mb-1">{spot.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          ⭐ {spot.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Navigation className="w-3 h-3" />
                          {spot.distance}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{spot.description}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ))}

          {/* User Location */}
          {userLocation && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                left: `${(userLocation.lng - 34.7) * 800 + 200}px`,
                top: `${(32.2 - userLocation.lat) * 600 + 100}px`
              }}
            >
              <div className="relative">
                <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
              </div>
            </div>
          )}

          {/* Map Labels */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
            <div className="text-xs font-medium text-gray-700">Tel Aviv Area</div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
            <div className="text-xs font-medium text-gray-700 mb-2">Legend</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span>Your Location</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white border-2 border-blue-500 rounded-full"></div>
                <span>Flying Spots</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500/30 border border-red-500 rounded-full"></div>
                <span>No-Fly Zones</span>
              </div>
            </div>
          </div>

          {/* Compass */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm">
            <div className="w-8 h-8 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close popup */}
      {selectedSpot && (
        <div 
          className="absolute inset-0 z-5"
          onClick={() => setSelectedSpot(null)}
        />
      )}
    </div>
  )
}

export default MapComponent

