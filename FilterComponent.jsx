import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { X, Filter, Search, Mountain, Waves, Building, Trees, MapPin, Star } from 'lucide-react'

const FilterComponent = ({ isOpen, onClose, onApplyFilters, spots }) => {
  const [filters, setFilters] = useState({
    searchQuery: '',
    landscapeTypes: [],
    maxDistance: [50],
    difficulty: [],
    minRating: [0],
    showOnlyPermitted: true
  })

  const landscapeTypes = [
    { id: 'mountain', label: 'Mountains', icon: Mountain, color: 'bg-gray-100 text-gray-800' },
    { id: 'coastal', label: 'Coastal', icon: Waves, color: 'bg-blue-100 text-blue-800' },
    { id: 'urban', label: 'Urban', icon: Building, color: 'bg-purple-100 text-purple-800' },
    { id: 'forest', label: 'Forest', icon: Trees, color: 'bg-green-100 text-green-800' },
    { id: 'desert', label: 'Desert', icon: MapPin, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'river', label: 'River', icon: Waves, color: 'bg-cyan-100 text-cyan-800' }
  ]

  const difficultyLevels = [
    { id: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
    { id: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'expert', label: 'Expert', color: 'bg-red-100 text-red-800' }
  ]

  const toggleLandscapeType = (typeId) => {
    setFilters(prev => ({
      ...prev,
      landscapeTypes: prev.landscapeTypes.includes(typeId)
        ? prev.landscapeTypes.filter(id => id !== typeId)
        : [...prev.landscapeTypes, typeId]
    }))
  }

  const toggleDifficulty = (difficultyId) => {
    setFilters(prev => ({
      ...prev,
      difficulty: prev.difficulty.includes(difficultyId)
        ? prev.difficulty.filter(id => id !== difficultyId)
        : [...prev.difficulty, difficultyId]
    }))
  }

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      landscapeTypes: [],
      maxDistance: [50],
      difficulty: [],
      minRating: [0],
      showOnlyPermitted: true
    })
  }

  const applyFilters = () => {
    onApplyFilters(filters)
    onClose()
  }

  const getFilteredSpots = () => {
    return spots.filter(spot => {
      // Search query filter
      if (filters.searchQuery && !spot.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false
      }

      // Landscape type filter
      if (filters.landscapeTypes.length > 0 && !filters.landscapeTypes.includes(spot.type.toLowerCase())) {
        return false
      }

      // Distance filter (convert km to number)
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
  }

  const filteredSpots = getFilteredSpots()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full max-h-[80vh] rounded-t-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Filters & Search</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="p-4 space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-2">Search Spots</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Landscape Types */}
            <div>
              <label className="block text-sm font-medium mb-3">Landscape Type</label>
              <div className="grid grid-cols-2 gap-2">
                {landscapeTypes.map((type) => {
                  const Icon = type.icon
                  const isSelected = filters.landscapeTypes.includes(type.id)
                  return (
                    <Button
                      key={type.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleLandscapeType(type.id)}
                      className="justify-start"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {type.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Distance */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Max Distance: {filters.maxDistance[0]} km
              </label>
              <Slider
                value={filters.maxDistance}
                onValueChange={(value) => setFilters(prev => ({ ...prev, maxDistance: value }))}
                max={100}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 km</span>
                <span>100+ km</span>
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium mb-3">Difficulty Level</label>
              <div className="flex gap-2">
                {difficultyLevels.map((level) => {
                  const isSelected = filters.difficulty.includes(level.id)
                  return (
                    <Button
                      key={level.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleDifficulty(level.id)}
                    >
                      {level.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Minimum Rating: {filters.minRating[0].toFixed(1)} ⭐
              </label>
              <Slider
                value={filters.minRating}
                onValueChange={(value) => setFilters(prev => ({ ...prev, minRating: value }))}
                max={5}
                min={0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0 ⭐</span>
                <span>5 ⭐</span>
              </div>
            </div>

            {/* Flight Restrictions */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Show only permitted flights</label>
                <p className="text-xs text-gray-500">Hide spots with flight restrictions</p>
              </div>
              <Switch
                checked={filters.showOnlyPermitted}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showOnlyPermitted: checked }))}
              />
            </div>

            {/* Results Preview */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">Results Preview</span>
              </div>
              <p className="text-sm text-gray-600">
                {filteredSpots.length} of {spots.length} spots match your criteria
              </p>
              {filteredSpots.length > 0 && (
                <div className="mt-2 space-y-1">
                  {filteredSpots.slice(0, 3).map((spot) => (
                    <div key={spot.id} className="text-xs text-gray-500 flex items-center gap-2">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{spot.name} ({spot.rating}⭐)</span>
                    </div>
                  ))}
                  {filteredSpots.length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{filteredSpots.length - 3} more spots
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex gap-3">
          <Button variant="outline" onClick={resetFilters} className="flex-1">
            Reset
          </Button>
          <Button onClick={applyFilters} className="flex-1">
            Apply Filters ({filteredSpots.length})
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FilterComponent

