import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Download, Wifi, WifiOff, HardDrive, RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react'

const OfflineManager = ({ spots, onCacheUpdate }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [cacheStatus, setCacheStatus] = useState({
    spots: { cached: 0, total: 0, lastUpdate: null },
    maps: { cached: 0, total: 0, lastUpdate: null },
    media: { cached: 0, total: 0, lastUpdate: null }
  })
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const [cacheSize, setCacheSize] = useState(0)

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Initialize cache status
  useEffect(() => {
    loadCacheStatus()
  }, [spots])

  const loadCacheStatus = () => {
    try {
      const cachedSpots = JSON.parse(localStorage.getItem('fpv_cached_spots') || '[]')
      const cachedMaps = JSON.parse(localStorage.getItem('fpv_cached_maps') || '[]')
      const cachedMedia = JSON.parse(localStorage.getItem('fpv_cached_media') || '[]')
      const lastUpdate = localStorage.getItem('fpv_cache_last_update')

      setCacheStatus({
        spots: {
          cached: cachedSpots.length,
          total: spots.length,
          lastUpdate: lastUpdate
        },
        maps: {
          cached: cachedMaps.length,
          total: 5, // Assume 5 map tiles needed for offline
          lastUpdate: lastUpdate
        },
        media: {
          cached: cachedMedia.length,
          total: spots.reduce((acc, spot) => acc + (spot.photos || 0) + (spot.videos || 0), 0),
          lastUpdate: lastUpdate
        }
      })

      // Calculate cache size (mock calculation)
      const totalCacheSize = (cachedSpots.length * 2) + (cachedMaps.length * 5) + (cachedMedia.length * 10)
      setCacheSize(totalCacheSize)
    } catch (error) {
      console.error('Error loading cache status:', error)
    }
  }

  const downloadForOffline = async () => {
    setIsDownloading(true)
    setDownloadProgress(0)

    try {
      // Simulate downloading spots data
      await simulateDownload('spots', spots)
      setDownloadProgress(33)

      // Simulate downloading map tiles
      await simulateDownload('maps', Array(5).fill(null).map((_, i) => ({ id: i, tile: `tile_${i}` })))
      setDownloadProgress(66)

      // Simulate downloading media
      const mediaItems = spots.flatMap(spot => [
        ...Array(spot.photos || 0).fill(null).map((_, i) => ({ type: 'photo', spotId: spot.id, id: i })),
        ...Array(spot.videos || 0).fill(null).map((_, i) => ({ type: 'video', spotId: spot.id, id: i }))
      ])
      await simulateDownload('media', mediaItems)
      setDownloadProgress(100)

      // Update cache timestamp
      localStorage.setItem('fpv_cache_last_update', new Date().toISOString())

      // Reload cache status
      loadCacheStatus()

      if (onCacheUpdate) {
        onCacheUpdate()
      }
    } catch (error) {
      console.error('Error downloading for offline:', error)
    } finally {
      setIsDownloading(false)
      setTimeout(() => setDownloadProgress(0), 2000)
    }
  }

  const simulateDownload = async (type, items) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Store in localStorage (in real app, would use IndexedDB or similar)
    localStorage.setItem(`fpv_cached_${type}`, JSON.stringify(items))
  }

  const clearCache = () => {
    localStorage.removeItem('fpv_cached_spots')
    localStorage.removeItem('fpv_cached_maps')
    localStorage.removeItem('fpv_cached_media')
    localStorage.removeItem('fpv_cache_last_update')
    
    setCacheStatus({
      spots: { cached: 0, total: spots.length, lastUpdate: null },
      maps: { cached: 0, total: 5, lastUpdate: null },
      media: { cached: 0, total: spots.reduce((acc, spot) => acc + (spot.photos || 0) + (spot.videos || 0), 0), lastUpdate: null }
    })
    setCacheSize(0)

    if (onCacheUpdate) {
      onCacheUpdate()
    }
  }

  const formatCacheSize = (sizeInMB) => {
    if (sizeInMB < 1) return `${(sizeInMB * 1024).toFixed(0)} KB`
    if (sizeInMB < 1024) return `${sizeInMB.toFixed(1)} MB`
    return `${(sizeInMB / 1024).toFixed(1)} GB`
  }

  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return 'Never'
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`
    return date.toLocaleDateString()
  }

  const getCacheProgress = (cached, total) => {
    return total > 0 ? (cached / total) * 100 : 0
  }

  const isFullyCached = () => {
    return cacheStatus.spots.cached === cacheStatus.spots.total &&
           cacheStatus.maps.cached === cacheStatus.maps.total &&
           cacheStatus.media.cached === cacheStatus.media.total
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="w-5 h-5 text-green-600" />
                <span>Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-red-600" />
                <span>Offline</span>
              </>
            )}
          </CardTitle>
          <CardDescription>
            {isOnline 
              ? "Connected to internet. You can download content for offline use."
              : "No internet connection. Using cached content."
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Cache Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Offline Cache
          </CardTitle>
          <CardDescription>
            Download content for offline access in areas with poor connectivity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isFullyCached() ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-600" />
              )}
              <span className="font-medium">
                {isFullyCached() ? 'Fully Cached' : 'Partially Cached'}
              </span>
            </div>
            <Badge variant="outline">
              {formatCacheSize(cacheSize)}
            </Badge>
          </div>

          {/* Cache Details */}
          <div className="space-y-3">
            {/* Spots Cache */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Flying Spots</span>
                <span className="text-sm text-gray-600">
                  {cacheStatus.spots.cached}/{cacheStatus.spots.total}
                </span>
              </div>
              <Progress value={getCacheProgress(cacheStatus.spots.cached, cacheStatus.spots.total)} />
            </div>

            {/* Maps Cache */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Map Tiles</span>
                <span className="text-sm text-gray-600">
                  {cacheStatus.maps.cached}/{cacheStatus.maps.total}
                </span>
              </div>
              <Progress value={getCacheProgress(cacheStatus.maps.cached, cacheStatus.maps.total)} />
            </div>

            {/* Media Cache */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Photos & Videos</span>
                <span className="text-sm text-gray-600">
                  {cacheStatus.media.cached}/{cacheStatus.media.total}
                </span>
              </div>
              <Progress value={getCacheProgress(cacheStatus.media.cached, cacheStatus.media.total)} />
            </div>
          </div>

          {/* Last Update */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Last updated: {formatLastUpdate(cacheStatus.spots.lastUpdate)}</span>
          </div>

          {/* Download Progress */}
          {isDownloading && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Downloading...</span>
                <span className="text-sm text-gray-600">{downloadProgress}%</span>
              </div>
              <Progress value={downloadProgress} />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={downloadForOffline}
              disabled={!isOnline || isDownloading}
              className="flex-1"
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download for Offline
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={clearCache}
              disabled={cacheSize === 0}
            >
              Clear Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Offline Features */}
      <Card>
        <CardHeader>
          <CardTitle>Offline Features</CardTitle>
          <CardDescription>
            Available functionality when offline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">✓ Available Offline</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• View cached flying spots</li>
                <li>• Browse offline maps</li>
                <li>• Access spot details & photos</li>
                <li>• Use filters & search</li>
                <li>• View landscape analysis</li>
                <li>• Read reviews & ratings</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-orange-600">⚠ Requires Internet</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Submit new spots</li>
                <li>• Post reviews & ratings</li>
                <li>• Upload photos & videos</li>
                <li>• Real-time CAAI updates</li>
                <li>• Weather information</li>
                <li>• Live map updates</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OfflineManager

