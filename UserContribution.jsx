import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Star, MapPin, Upload, Camera, Video, Plus, X, ThumbsUp, MessageCircle, Flag } from 'lucide-react'

const UserContribution = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    landscapeType: '',
    difficulty: '',
    coordinates: null,
    photos: [],
    videos: [],
    rating: 0,
    review: '',
    tags: []
  })

  const [currentTag, setCurrentTag] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const landscapeTypes = ['Mountain', 'Coastal', 'Urban', 'Forest', 'Desert', 'River', 'Valley', 'Lake']
  const difficultyLevels = ['Beginner', 'Intermediate', 'Expert']

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleFileUpload = (files, type) => {
    const fileArray = Array.from(files).slice(0, 5) // Limit to 5 files
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], ...fileArray].slice(0, 5)
    }))
  }

  const removeFile = (index, type) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = e.dataTransfer.files
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
      const videoFiles = Array.from(files).filter(file => file.type.startsWith('video/'))
      
      if (imageFiles.length > 0) {
        handleFileUpload(imageFiles, 'photos')
      }
      if (videoFiles.length > 0) {
        handleFileUpload(videoFiles, 'videos')
      }
    }
  }

  const handleSubmit = () => {
    if (formData.name && formData.description && formData.landscapeType && formData.difficulty) {
      onSubmit(formData)
      onClose()
    }
  }

  const setCurrentLocation = () => {
    // Mock location setting - in real app would use geolocation API
    setFormData(prev => ({
      ...prev,
      coordinates: { lat: 32.0853, lng: 34.7818 }
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Contribute a Flying Spot</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-4 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Spot Name *</label>
              <Input
                placeholder="e.g., Sunset Ridge Overlook"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <Textarea
                placeholder="Describe the spot, its features, and what makes it special for FPV flying..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="h-24"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <div className="space-y-2">
              <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  {formData.coordinates ? (
                    <div>
                      <p className="text-sm text-green-600 font-medium">Location Set</p>
                      <p className="text-xs text-gray-500">
                        {formData.coordinates.lat.toFixed(4)}, {formData.coordinates.lng.toFixed(4)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Tap to set location on map</p>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={setCurrentLocation} className="w-full">
                <MapPin className="w-4 h-4 mr-2" />
                Use Current Location
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Landscape Type *</label>
              <div className="grid grid-cols-2 gap-2">
                {landscapeTypes.map((type) => (
                  <Button
                    key={type}
                    variant={formData.landscapeType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange('landscapeType', type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Difficulty Level *</label>
              <div className="space-y-2">
                {difficultyLevels.map((level) => (
                  <Button
                    key={level}
                    variant={formData.difficulty === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange('difficulty', level)}
                    className="w-full"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">Your Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= formData.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {formData.rating > 0 ? `${formData.rating}/5` : 'No rating'}
              </span>
            </div>
          </div>

          {/* Review */}
          <div>
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <Textarea
              placeholder="Share your experience flying at this spot..."
              value={formData.review}
              onChange={(e) => handleInputChange('review', e.target.value)}
              className="h-20"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag (e.g., windy, scenic, challenging)"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button onClick={addTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Photos & Videos</label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-2">
                <div className="flex justify-center gap-2">
                  <Camera className="w-8 h-8 text-gray-400" />
                  <Video className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">
                  Drag & drop photos or videos here, or click to browse
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photos
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="w-4 h-4 mr-2" />
                    Upload Videos
                  </Button>
                </div>
              </div>
            </div>

            {/* File Preview */}
            {(formData.photos.length > 0 || formData.videos.length > 0) && (
              <div className="mt-4 space-y-2">
                {formData.photos.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Photos ({formData.photos.length}/5)</p>
                    <div className="flex gap-2 flex-wrap">
                      {formData.photos.map((file, index) => (
                        <div key={index} className="relative">
                          <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center">
                            <Camera className="w-6 h-6 text-gray-400" />
                          </div>
                          <button
                            onClick={() => removeFile(index, 'photos')}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.videos.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Videos ({formData.videos.length}/5)</p>
                    <div className="flex gap-2 flex-wrap">
                      {formData.videos.map((file, index) => (
                        <div key={index} className="relative">
                          <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center">
                            <Video className="w-6 h-6 text-gray-400" />
                          </div>
                          <button
                            onClick={() => removeFile(index, 'videos')}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="flex-1"
            disabled={!formData.name || !formData.description || !formData.landscapeType || !formData.difficulty}
          >
            <Plus className="w-4 h-4 mr-2" />
            Submit Spot
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserContribution

