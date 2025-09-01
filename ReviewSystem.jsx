import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Flag, User, Calendar, Camera, Video } from 'lucide-react'

const ReviewSystem = ({ spot, reviews, onAddReview, onLikeReview, onReportReview }) => {
  const [showAddReview, setShowAddReview] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    photos: [],
    videos: []
  })

  // Mock reviews data
  const mockReviews = [
    {
      id: 1,
      user: "FPVPilot_Alex",
      avatar: null,
      rating: 5,
      date: "2024-08-15",
      comment: "Absolutely stunning location! Perfect for cinematic shots during golden hour. Wind conditions were manageable and the views are incredible. Highly recommend for intermediate to advanced pilots.",
      likes: 12,
      dislikes: 0,
      photos: 3,
      videos: 1,
      helpful: true,
      tags: ["scenic", "windy", "golden-hour"]
    },
    {
      id: 2,
      user: "DroneExplorer",
      avatar: null,
      rating: 4,
      date: "2024-08-10",
      comment: "Great spot for FPV flying! The coastal views are amazing and there's plenty of space to fly safely. Just be careful of the wind near the cliff edges. Best time is early morning.",
      likes: 8,
      dislikes: 1,
      photos: 2,
      videos: 0,
      helpful: true,
      tags: ["coastal", "morning", "spacious"]
    },
    {
      id: 3,
      user: "CinematicFPV",
      avatar: null,
      rating: 4,
      date: "2024-08-05",
      comment: "Solid location for practice flights. Not too challenging but offers good variety for different shot types. Parking can be tricky during weekends.",
      likes: 5,
      dislikes: 0,
      photos: 1,
      videos: 2,
      helpful: false,
      tags: ["practice", "weekend", "parking"]
    }
  ]

  const [displayedReviews, setDisplayedReviews] = useState(mockReviews)

  const handleRatingClick = (rating) => {
    setNewReview(prev => ({ ...prev, rating }))
  }

  const handleSubmitReview = () => {
    if (newReview.rating > 0 && newReview.comment.trim()) {
      const review = {
        id: Date.now(),
        user: "CurrentUser",
        avatar: null,
        rating: newReview.rating,
        date: new Date().toISOString().split('T')[0],
        comment: newReview.comment,
        likes: 0,
        dislikes: 0,
        photos: newReview.photos.length,
        videos: newReview.videos.length,
        helpful: false,
        tags: []
      }

      setDisplayedReviews(prev => [review, ...prev])
      setNewReview({ rating: 0, comment: '', photos: [], videos: [] })
      setShowAddReview(false)

      if (onAddReview) {
        onAddReview(review)
      }
    }
  }

  const handleLike = (reviewId) => {
    setDisplayedReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? { ...review, likes: review.likes + 1 }
          : review
      )
    )
    if (onLikeReview) {
      onLikeReview(reviewId)
    }
  }

  const handleReport = (reviewId) => {
    if (onReportReview) {
      onReportReview(reviewId)
    }
  }

  const getAverageRating = () => {
    if (displayedReviews.length === 0) return 0
    const sum = displayedReviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / displayedReviews.length).toFixed(1)
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    displayedReviews.forEach(review => {
      distribution[review.rating]++
    })
    return distribution
  }

  const ratingDistribution = getRatingDistribution()

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            Reviews & Ratings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {getAverageRating()}
              </div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(getAverageRating())
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">
                Based on {displayedReviews.length} reviews
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${displayedReviews.length > 0 ? (ratingDistribution[rating] / displayedReviews.length) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {ratingDistribution[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Review Button */}
          <div className="mt-6 pt-4 border-t">
            <Button
              onClick={() => setShowAddReview(true)}
              className="w-full"
              variant={showAddReview ? "outline" : "default"}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {showAddReview ? "Cancel Review" : "Write a Review"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Review Form */}
      {showAddReview && (
        <Card>
          <CardHeader>
            <CardTitle>Write Your Review</CardTitle>
            <CardDescription>
              Share your experience flying at {spot.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                        star <= newReview.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {newReview.rating > 0 ? `${newReview.rating}/5` : 'Select rating'}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <Textarea
                placeholder="Share details about your flying experience, conditions, tips for other pilots..."
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                className="h-24"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAddReview(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={newReview.rating === 0 || !newReview.comment.trim()}
                className="flex-1"
              >
                Submit Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Reviews ({displayedReviews.length})
        </h3>

        {displayedReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{review.user}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {new Date(review.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Content */}
              <p className="text-gray-700 mb-3">{review.comment}</p>

              {/* Media Indicators */}
              {(review.photos > 0 || review.videos > 0) && (
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                  {review.photos > 0 && (
                    <div className="flex items-center gap-1">
                      <Camera className="w-4 h-4" />
                      <span>{review.photos} photo{review.photos > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {review.videos > 0 && (
                    <div className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      <span>{review.videos} video{review.videos > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {review.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {review.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(review.id)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.likes}</span>
                  </button>
                  {review.helpful && (
                    <Badge variant="secondary" className="text-xs">
                      Helpful
                    </Badge>
                  )}
                </div>
                <button
                  onClick={() => handleReport(review.id)}
                  className="text-sm text-gray-400 hover:text-red-600"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ReviewSystem

