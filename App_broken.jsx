import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { MapPin, Search, Filter, Star, Navigation, Plus, User, AlertTriangle, Mountain, Waves, Building, Trees, Camera, X } from 'lucide-react'
import MapComponent from './components/MapComponent.jsx'
import FilterComponent from './components/FilterComponent.jsx'
import LandscapeAnalysis from './components/LandscapeAnalysis.jsx'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('map')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filteredSpots, setFilteredSpots] = useState([])
  const [selectedSpotForAnalysis, setSelectedSpotForAnalysis] = useState(null)

  // Mock data for flying spots
  const flyingSpots = [
    {
      id: 1,
      name: "Mount Carmel Overlook",
      type: "Mountain",
      rating: 4.8,
      distance: "2.5 km",
      difficulty: "Expert",
      description: "Stunning mountain views with challenging wind conditions",
      restrictions: "Day flights only",
      coordinates: { lat: 32.7767, lng: 34.9796 }
    },
    {
      id: 2,
      name: "Tel Aviv Beach",
      type: "Coastal",
      rating: 4.2,
      distance: "5.1 km",
      difficulty: "Beginner",
      description: "Beautiful coastal shots with minimal obstacles",
      restrictions: "Stay 250m from people",
      coordinates: { lat: 32.0853, lng: 34.7818 }
    },
    {
      id: 3,
      name: "Yarkon Park",
      type: "Urban",
      rating: 4.5,
      distance: "1.8 km",
      difficulty: "Intermediate",
      description: "Urban park with river views and city skyline",
      restrictions: "Weekend restrictions apply",
      coordinates: { lat: 32.1133, lng: 34.8044 }
    }
  ]

  const [displayedSpots, setDisplayedSpots] = useState(flyingSpots)

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Mountain': return <Mountain className="w-4 h-4" />
      case 'Coastal': return <Waves className="w-4 h-4" />
      case 'Urban': return <Building className="w-4 h-4" />
      case 'Forest': return <Trees className="w-4 h-4" />
      default: return <MapPin className="w-4 h-4" />
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleApplyFilters = (filters) => {
    let filtered = flyingSpots.filter(spot => {
      // Search query filter
      if (filters.searchQuery && !spot.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false
      }

      // Landscape type filter
      if (filters.landscapeTypes.length > 0 && !filters.landscapeTypes.includes(spot.type.toLowerCase())) {
        return false
      }

      // Distance filter
      const spotDistance = parseFloat(spot.distance.replace(' km', ''))
      if (spotDistance > filters.maxDistance[0]) {
        return false
      }

      // Difficulty filter
      if (filters.difficulty.length > 0 && !filters.difficulty.includes(spot.difficulty.toLowerCase())) {
        return false
      }

      // Rating filter
      if (spot.rating < filters.minRating[0]) {
        return false
      }

      return true
    })

    setDisplayedSpots(filtered)
    setFilteredSpots(filtered)
  }

  const MapView = () => (
    <div className="h-full relative">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search for spots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/90 backdrop-blur-sm"
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white/90 backdrop-blur-sm"
            onClick={() => setShowFilters(true)}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Map Component */}
      <MapComponent spots={displayedSpots} />

      {/* No-Fly Zone Warning */}
      <div className="absolute bottom-20 left-4 right-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-800">
                You are near a restricted airspace. Check regulations before flying.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const SpotsView = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Flying Spots</h2>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="space-y-3">
        {flyingSpots.map((spot) => (
          <Card key={spot.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(spot.type)}
                    <h3 className="font-semibold">{spot.name}</h3>
                    <Badge variant="secondary" className={getDifficultyColor(spot.difficulty)}>
                      {spot.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{spot.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Navigation className="w-4 h-4" />
                      <span>{spot.distance}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{spot.description}</p>
                  
                  <div className="flex items-center gap-1 text-xs text-orange-600">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{spot.restrictions}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const ContributeView = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Spot</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Contribute a Flying Spot</CardTitle>
          <CardDescription>
            Help other FPV pilots by sharing your favorite flying locations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Spot Name</label>
            <Input placeholder="e.g., Sunset Ridge Overlook" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Tap to set location on map</p>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Landscape Type</label>
            <div className="flex gap-2 flex-wrap">
              {['Mountain', 'Coastal', 'Urban', 'Forest', 'Desert', 'River'].map((type) => (
                <Badge key={type} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea 
              className="w-full p-3 border rounded-lg resize-none h-24"
              placeholder="Describe the spot, its features, and any flying considerations..."
            />
          </div>
          
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Submit Spot
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const ProfileView = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">FPV Pilot</h3>
              <p className="text-gray-600">Member since 2024</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Spots Added</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">48</div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <MapPin className="w-4 h-4 mr-2" />
              My Favorite Spots
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Star className="w-4 h-4 mr-2" />
              My Reviews
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Safety Guidelines
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold text-center">FPV Drone Spotter</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsContent value="map" className="flex-1 m-0">
            <MapView />
          </TabsContent>
          <TabsContent value="spots" className="flex-1 m-0 overflow-auto">
            <SpotsView />
          </TabsContent>
          <TabsContent value="contribute" className="flex-1 m-0 overflow-auto">
            <ContributeView />
          </TabsContent>
          <TabsContent value="profile" className="flex-1 m-0 overflow-auto">
            <ProfileView />
          </TabsContent>

          {/* Bottom Navigation */}
          <TabsList className="grid w-full grid-cols-4 rounded-none border-t bg-white h-16">
            <TabsTrigger value="map" className="flex flex-col gap-1 h-full">
              <MapPin className="w-5 h-5" />
              <span className="text-xs">Map</span>
            </TabsTrigger>
            <TabsTrigger value="spots" className="flex flex-col gap-1 h-full">
              <Star className="w-5 h-5" />
              <span className="text-xs">Spots</span>
            </TabsTrigger>
            <TabsTrigger value="contribute" className="flex flex-col gap-1 h-full">
              <Plus className="w-5 h-5" />
              <span className="text-xs">Add</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex flex-col gap-1 h-full">
              <User className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </main>
    </div>
  )
}

export default App


  const SpotsView = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Flying Spots</h2>
        <Button variant="outline" size="sm" onClick={() => setShowFilters(true)}>
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="space-y-3">
        {displayedSpots.map((spot) => (
          <Card key={spot.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(spot.type)}
                    <h3 className="font-semibold">{spot.name}</h3>
                    <Badge variant="secondary" className={getDifficultyColor(spot.difficulty)}>
                      {spot.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{spot.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Navigation className="w-4 h-4" />
                      <span>{spot.distance}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{spot.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-orange-600">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{spot.restrictions}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedSpotForAnalysis(spot)}
                    >
                      <Camera className="w-3 h-3 mr-1" />
                      Analyze
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Landscape Analysis Modal */}
      {selectedSpotForAnalysis && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Landscape Analysis</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedSpotForAnalysis(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-4">
              <LandscapeAnalysis 
                spot={selectedSpotForAnalysis}
                onAnalysisComplete={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const ContributeView = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Spot</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Contribute a Flying Spot</CardTitle>
          <CardDescription>
            Help other FPV pilots by sharing your favorite flying locations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Spot Name</label>
            <Input placeholder="e.g., Sunset Ridge Overlook" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Tap to set location on map</p>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Landscape Type</label>
            <div className="flex gap-2 flex-wrap">
              {['Mountain', 'Coastal', 'Urban', 'Forest', 'Desert', 'River'].map((type) => (
                <Badge key={type} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea 
              className="w-full p-3 border rounded-lg resize-none h-24"
              placeholder="Describe the spot, its features, and any flying considerations..."
            />
          </div>
          
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Submit Spot
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const ProfileView = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">FPV Pilot</h3>
              <p className="text-gray-600">Member since 2024</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Spots Added</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">48</div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <MapPin className="w-4 h-4 mr-2" />
              My Favorite Spots
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Star className="w-4 h-4 mr-2" />
              My Reviews
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Safety Guidelines
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold text-center">FPV Drone Spotter</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsContent value="map" className="flex-1 m-0">
            <MapView />
          </TabsContent>
          <TabsContent value="spots" className="flex-1 m-0 overflow-auto">
            <SpotsView />
          </TabsContent>
          <TabsContent value="contribute" className="flex-1 m-0 overflow-auto">
            <ContributeView />
          </TabsContent>
          <TabsContent value="profile" className="flex-1 m-0 overflow-auto">
            <ProfileView />
          </TabsContent>

          {/* Bottom Navigation */}
          <TabsList className="grid w-full grid-cols-4 rounded-none border-t bg-white h-16">
            <TabsTrigger value="map" className="flex flex-col gap-1 h-full">
              <MapPin className="w-5 h-5" />
              <span className="text-xs">Map</span>
            </TabsTrigger>
            <TabsTrigger value="spots" className="flex flex-col gap-1 h-full">
              <Star className="w-5 h-5" />
              <span className="text-xs">Spots</span>
            </TabsTrigger>
            <TabsTrigger value="contribute" className="flex flex-col gap-1 h-full">
              <Plus className="w-5 h-5" />
              <span className="text-xs">Add</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex flex-col gap-1 h-full">
              <User className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </main>

      {/* Filter Component */}
      <FilterComponent
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
        spots={flyingSpots}
      />
    </div>
  )
}

export default App

