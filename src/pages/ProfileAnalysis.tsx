
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";
import AIAnalysisResult from "@/components/AIAnalysisResult";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

// Simulated AI analysis results - in a real app, this would come from an API
const sampleAnalysis = {
  title: "Your Profile Analysis",
  suggestions: [
    {
      type: "positive" as const,
      text: "Your smile is authentic and creates a warm, approachable vibe that will attract matches."
    },
    {
      type: "positive" as const,
      text: "The lighting in your photo is excellent, highlighting your features well."
    },
    {
      type: "improvement" as const,
      text: "The background is cluttered, which can be distracting. Try a cleaner setting to keep the focus on you."
    },
    {
      type: "improvement" as const,
      text: "Your photo appears to be a selfie. Consider adding photos taken by others to show more natural poses."
    },
    {
      type: "tip" as const,
      text: "Adding a photo showing you engaged in a hobby would help showcase your personality and interests."
    },
    {
      type: "tip" as const,
      text: "A full-body photo would provide a more complete impression for potential matches."
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
      toast.error("Please upload an image to analyze");
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
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Profile Analysis</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your dating profile photo and get AI-powered feedback to make it more attractive to potential matches.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Upload Your Photo</CardTitle>
                  <CardDescription>
                    Choose a profile picture that you're currently using or planning to use
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ImageUploader
                    onImageUpload={handleImageUpload}
                    title="Upload Profile Photo"
                    description="Drag and drop your profile photo here, or click to browse"
                  />
                  
                  <Button 
                    className="w-full mt-4" 
                    onClick={analyzeProfile} 
                    disabled={!file || isAnalyzing}
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze My Profile"}
                  </Button>
                </CardContent>
              </Card>
              
              <div className="mt-6 text-sm text-muted-foreground">
                <p>
                  <strong>Tips for best results:</strong>
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Use a clear, high-quality photo of yourself</li>
                  <li>Upload a photo that shows your face clearly</li>
                  <li>Choose photos that represent how you currently look</li>
                  <li>For comprehensive feedback, try analyzing a few different photos</li>
                </ul>
              </div>
            </div>
            
            {/* Results Section */}
            <div>
              {isAnalyzing ? (
                <AIAnalysisResult 
                  title="Analyzing your profile..." 
                  suggestions={[]} 
                  isLoading={true} 
                />
              ) : results ? (
                <AIAnalysisResult 
                  title={results.title} 
                  suggestions={results.suggestions} 
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-muted/30 rounded-xl border border-dashed p-8 text-center">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Your analysis will appear here</h3>
                    <p className="text-muted-foreground">
                      Upload a photo and click "Analyze My Profile" to get started
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
