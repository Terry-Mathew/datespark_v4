
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ImageUploader from "@/components/ImageUploader";
import ProfileAnalysisResult from "@/components/ProfileAnalysisResult";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { ArrowUpRight, Camera, FileText, Clock } from "lucide-react";

// Simulated AI analysis results - in a real app, this would come from an API
const sampleAnalysis = {
  title: "Your Profile Analysis",
  score: 7.5,
  firstImpression: {
    would_swipe: "right",
    reason: "Your profile stands out with an authentic smile and good lighting, though the background is slightly distracting."
  },
  photoFeedback: [
    {
      type: "positive",
      text: "Your smile is authentic and creates a warm, approachable vibe."
    },
    {
      type: "positive",
      text: "The lighting in your photo is excellent, highlighting your features well."
    },
    {
      type: "improvement",
      text: "The background is cluttered, which can be distracting. Try a cleaner setting."
    },
    {
      type: "improvement",
      text: "Your photo appears to be a selfie. Consider adding photos taken by others to show more natural poses."
    }
  ],
  bioFeedback: [
    {
      type: "positive",
      text: "Your bio has a good balance of humor and sincerity."
    },
    {
      type: "improvement",
      text: "The phrase 'work hard, play hard' is overused in dating profiles. Try something more unique."
    }
  ],
  improvementSuggestions: [
    {
      title: "Add a full-body photo",
      description: "This provides a more complete impression for potential matches.",
      actionText: "Upload new photo"
    },
    {
      title: "Show yourself engaged in a hobby",
      description: "Photos of you doing activities you enjoy showcase your personality and interests.",
      actionText: "Upload activity photo"
    },
    {
      title: "Revise your bio to remove clichés",
      description: "Replace common phrases with more specific and unique descriptions.",
      actionText: "Edit bio now"
    }
  ]
};

const ProfileAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<typeof sampleAnalysis | null>(null);
  
  const handleImageUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setResults(null); // Reset results when a new image is uploaded
  };
  
  const analyzeProfile = () => {
    if (!file) {
      toast.error("Please upload images of your dating profile");
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      setResults(sampleAnalysis);
      setIsAnalyzing(false);
      toast.success("Analysis complete!");
    }, 3000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Rate My Profile</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your dating profile photos and text to get AI-powered feedback on what's working and how to improve.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="mr-2 h-5 w-5 text-primary" />
                    Upload Your Profile
                  </CardTitle>
                  <CardDescription>
                    Upload screenshots of your dating profile (photos, bio, prompts)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ImageUploader
                    onImageUpload={handleImageUpload}
                    title="Upload Profile Screenshots"
                    description="Drag and drop your profile screenshots here, or click to browse"
                  />
                  
                  <Button 
                    className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90" 
                    onClick={analyzeProfile} 
                    disabled={!file || isAnalyzing}
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze My Profile"}
                  </Button>
                </CardContent>
              </Card>
              
              <div className="mt-6 text-sm text-muted-foreground">
                <p className="font-medium mb-2">
                  How it works:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="bg-primary/20 p-1 rounded-full mr-2 mt-0.5">
                      <Camera className="h-3.5 w-3.5 text-primary" />
                    </span>
                    <span>Upload screenshots of your dating profile</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 p-1 rounded-full mr-2 mt-0.5">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                    </span>
                    <span>Our AI analyzes your photos, bio, and prompts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 p-1 rounded-full mr-2 mt-0.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                    </span>
                    <span>Get detailed feedback and actionable suggestions in seconds</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Results Section */}
            <div>
              {isAnalyzing ? (
                <ProfileAnalysisResult 
                  isLoading={true} 
                />
              ) : results ? (
                <ProfileAnalysisResult 
                  score={results.score}
                  firstImpression={results.firstImpression}
                  photoFeedback={results.photoFeedback}
                  bioFeedback={results.bioFeedback}
                  improvementSuggestions={results.improvementSuggestions}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-muted/30 rounded-xl border border-dashed p-8 text-center">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Your analysis will appear here</h3>
                    <p className="text-muted-foreground">
                      Upload profile screenshots and click "Analyze My Profile" to get started
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfileAnalysis;
