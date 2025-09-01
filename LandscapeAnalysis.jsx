import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Mountain, Waves, Building, Trees, Sun, Wind, Camera, Zap, Eye, MapPin } from 'lucide-react'

const LandscapeAnalysis = ({ spot, onAnalysisComplete }) => {
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)

  // Mock landscape analysis data
  const mockAnalysis = {
    cinematicScore: 8.7,
    features: [
      { type: 'elevation', label: 'Elevation Changes', score: 9.2, description: 'Dramatic height variations for dynamic shots' },
      { type: 'water', label: 'Water Features', score: 7.8, description: 'Rivers and coastal areas for reflective shots' },
      { type: 'vegetation', label: 'Vegetation Density', score: 6.5, description: 'Mixed forest and open areas' },
      { type: 'structures', label: 'Interesting Structures', score: 8.1, description: 'Bridges, buildings, and landmarks' }
    ],
    lightingConditions: {
      goldenHour: { start: '06:30', end: '07:30', quality: 'Excellent' },
      blueHour: { start: '19:00', end: '19:45', quality: 'Good' },
      midday: { quality: 'Fair', note: 'Harsh shadows, consider filters' }
    },
    weatherFactors: {
      windExposure: 'Moderate',
      thermalActivity: 'Low',
      precipitation: 'Sheltered areas available'
    },
    shotRecommendations: [
      { type: 'Reveal Shot', description: 'Start low behind trees, rise to reveal the valley', difficulty: 'Intermediate' },
      { type: 'Follow Shot', description: 'Track along the river bend', difficulty: 'Beginner' },
      { type: 'Orbit Shot', description: 'Circle the prominent rock formation', difficulty: 'Expert' },
      { type: 'Proximity Shot', description: 'Weave between tree branches', difficulty: 'Expert' }
    ],
    safetyConsiderations: [
      'Watch for thermal updrafts near cliff faces',
      'Maintain safe distance from water surface',
      'Be aware of wildlife activity in early morning',
      'Check wind conditions before attempting proximity shots'
    ]
  }

  const runAnalysis = async () => {
    setIsAnalyzing(true)
    setProgress(0)

    // Simulate analysis progress
    const steps = [
      { step: 'Analyzing topography...', duration: 800 },
      { step: 'Identifying water features...', duration: 600 },
      { step: 'Evaluating vegetation patterns...', duration: 700 },
      { step: 'Assessing lighting conditions...', duration: 500 },
      { step: 'Generating shot recommendations...', duration: 900 },
      { step: 'Calculating cinematic score...', duration: 400 }
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].duration))
      setProgress(((i + 1) / steps.length) * 100)
    }

    setAnalysis(mockAnalysis)
    setIsAnalyzing(false)
    if (onAnalysisComplete) {
      onAnalysisComplete(mockAnalysis)
    }
  }

  const getFeatureIcon = (type) => {
    switch (type) {
      case 'elevation': return <Mountain className="w-4 h-4" />
      case 'water': return <Waves className="w-4 h-4" />
      case 'vegetation': return <Trees className="w-4 h-4" />
      case 'structures': return <Building className="w-4 h-4" />
      default: return <MapPin className="w-4 h-4" />
    }
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {/* Analysis Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Landscape Analysis for {spot.name}
          </CardTitle>
          <CardDescription>
            AI-powered analysis to identify the best cinematic opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!analysis && !isAnalyzing && (
            <Button onClick={runAnalysis} className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              Analyze Cinematic Potential
            </Button>
          )}

          {isAnalyzing && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 animate-pulse text-blue-500" />
                <span className="text-sm">Running landscape analysis...</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-gray-500 text-center">{progress.toFixed(0)}% complete</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <>
          {/* Cinematic Score */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {analysis.cinematicScore}/10
                </div>
                <div className="text-sm text-gray-600">Cinematic Potential Score</div>
                <div className="mt-3">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Excellent for FPV cinematography
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Landscape Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Landscape Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFeatureIcon(feature.type)}
                    <div>
                      <div className="font-medium text-sm">{feature.label}</div>
                      <div className="text-xs text-gray-600">{feature.description}</div>
                    </div>
                  </div>
                  <div className={`font-bold ${getScoreColor(feature.score)}`}>
                    {feature.score}/10
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shot Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommended Shots</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.shotRecommendations.map((shot, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">{shot.type}</div>
                    <Badge className={getDifficultyColor(shot.difficulty)}>
                      {shot.difficulty}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600">{shot.description}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Lighting Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sun className="w-5 h-5" />
                Optimal Lighting Times
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="font-medium text-sm text-orange-800">Golden Hour</div>
                  <div className="text-xs text-orange-600">
                    {analysis.lightingConditions.goldenHour.start} - {analysis.lightingConditions.goldenHour.end}
                  </div>
                  <div className="text-xs text-orange-600">
                    Quality: {analysis.lightingConditions.goldenHour.quality}
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-sm text-blue-800">Blue Hour</div>
                  <div className="text-xs text-blue-600">
                    {analysis.lightingConditions.blueHour.start} - {analysis.lightingConditions.blueHour.end}
                  </div>
                  <div className="text-xs text-blue-600">
                    Quality: {analysis.lightingConditions.blueHour.quality}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Considerations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wind className="w-5 h-5" />
                Safety Considerations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.safetyConsiderations.map((consideration, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    {consideration}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

export default LandscapeAnalysis

