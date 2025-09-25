"use client"

import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  Camera, 
  Sparkles, 
  Download, 
  RefreshCw, 
  X,
  User,
  AlertCircle 
} from "lucide-react"
import Image from "next/image"

interface CareerImageGeneratorProps {
  isOpen: boolean
  onClose: () => void
  careerTitle: string
  careerDescription: string
  careerIcon: React.ComponentType<{ className?: string }>
}

interface GeneratedImage {
  url: string
  prompt: string
  timestamp: number
  isGenerated: boolean
  success: boolean
  message?: string
}

export function CareerImageGenerator({
  isOpen,
  onClose,
  careerTitle,
  careerDescription,
  careerIcon: Icon,
}: CareerImageGeneratorProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file')
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB')
        return
      }

      setError(null)
      setUploadedFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const files = event.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        setUploadedFile(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  }, [])

  const generateCareerImage = async () => {
    if (!uploadedFile) {
      setError('Please upload an image first')
      return
    }

    setIsGenerating(true)
    setError(null)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      const formData = new FormData()
      formData.append('image', uploadedFile)
      formData.append('careerTitle', careerTitle)
      formData.append('careerDescription', careerDescription)

      const response = await fetch('/api/generate-career-image', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate image')
      }

      const data = await response.json()
      setGeneratedImage({
        url: data.imageUrl,
        prompt: data.prompt,
        timestamp: Date.now(),
        isGenerated: data.isGenerated || false,
        success: data.success || false,
        message: data.message
      })
      setProgress(100)
    } catch (err) {
      console.error('Error generating image:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate career image')
      setProgress(0)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = () => {
    if (!generatedImage) return

    const link = document.createElement('a')
    link.href = generatedImage.url
    link.download = `${careerTitle.toLowerCase().replace(/\s+/g, '-')}-career-visualization.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetModal = () => {
    setUploadedImage(null)
    setUploadedFile(null)
    setGeneratedImage(null)
    setError(null)
    setProgress(0)
    setIsGenerating(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">See Yourself as a {careerTitle}</h3>
              <p className="text-sm text-muted-foreground font-normal">
                Upload your photo and let AI visualize you in this career
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Career Info */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Icon className="h-8 w-8 text-primary" />
                <div>
                  <h4 className="font-semibold">{careerTitle}</h4>
                  <p className="text-sm text-muted-foreground">{careerDescription}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Your Photo
              </h4>

              {!uploadedImage ? (
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Click to upload or drag and drop</p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <div className="relative">
                      <Image
                        src={uploadedImage}
                        alt="Uploaded photo"
                        width={300}
                        height={300}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setUploadedImage(null)
                          setUploadedFile(null)
                          setGeneratedImage(null)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        onClick={() => document.getElementById('image-upload')?.click()}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                      <Button
                        onClick={generateCareerImage}
                        disabled={isGenerating}
                        className="flex-1"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate
                          </>
                        )}
                      </Button>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Result Section */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Generated Result
              </h4>

              {isGenerating && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                      </div>
                      <div>
                        <p className="font-medium">Creating your career visualization...</p>
                        <p className="text-sm text-muted-foreground">
                          This may take a few moments
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Progress value={progress} className="w-full" />
                        <p className="text-xs text-muted-foreground">{progress}% complete</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {generatedImage && !isGenerating && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <Image
                        src={generatedImage.url}
                        alt={`AI generated ${careerTitle} visualization`}
                        width={300}
                        height={300}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge 
                            variant={generatedImage.isGenerated ? "default" : "secondary"} 
                            className="text-xs"
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            {generatedImage.isGenerated ? "AI Generated" : "Enhanced Visualization"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {new Date(generatedImage.timestamp).toLocaleTimeString()}
                          </Badge>
                          {generatedImage.success && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              ✓ Success
                            </Badge>
                          )}
                        </div>
                        {generatedImage.message && (
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {generatedImage.message}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Prompt: {generatedImage.prompt}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={downloadImage}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          onClick={generateCareerImage}
                          size="sm"
                          className="flex-1"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!uploadedImage && !isGenerating && !generatedImage && (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center">
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">
                        Upload your photo to see AI-generated career visualization
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Card className="border-destructive bg-destructive/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-sm text-blue-900 dark:text-blue-100">
                    How it works
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Our AI analyzes your photo with Gemini and creates a professional visualization using Google's Imagen 4 image generation. 
                    The result shows you in professional attire and environment appropriate for the {careerTitle} field.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}