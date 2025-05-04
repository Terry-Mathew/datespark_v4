import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Camera, FileText, Clock, Loader2, Copy, Check } from "lucide-react";
import { getFunctions, httpsCallable, HttpsCallableResult } from "firebase/functions";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { analytics } from "@/config/firebase"; // Import analytics
import { logEvent } from "firebase/analytics"; // Import logEvent

interface AnalyzeProfileResponse {
  analysis: string;
}

const functions = getFunctions();
const analyzeProfileCallable = httpsCallable<
  { imageBase64: string }, 
  AnalyzeProfileResponse
>(functions, 'analyzeProfile');

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const ProfileAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  const handleImageUpload = (uploadedFile: File) => {
    if (!uploadedFile.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPEG, PNG, WEBP, GIF).");
      setFile(null);
      return;
    }
    if (uploadedFile.size > 5 * 1024 * 1024) {
        toast.error("Image file is too large. Please upload an image under 5MB.");
        setFile(null);
        return;
    }
    setFile(uploadedFile);
    setAnalysisResult(null);
    // Log image_uploaded event
    analytics.then(analyticInstance => {
      if (analyticInstance) {
        logEvent(analyticInstance, 'image_uploaded', { feature: 'profile_analysis', file_type: uploadedFile.type, file_size: uploadedFile.size });
      }
    });
  };

  const callAnalyzeProfileFunction = async () => {
    if (!user) {
      toast.error("Please sign in to analyze your profile.");
      return;
    }
    if (!file) {
      toast.error("Please upload an image of your dating profile screenshot.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setCopied(false);
    // Log analyze_profile_attempt event
    analytics.then(analyticInstance => {
      if (analyticInstance) {
        logEvent(analyticInstance, 'analyze_profile_attempt');
      }
    });

    try {
      const imageBase64 = await fileToBase64(file);
      const result: HttpsCallableResult<AnalyzeProfileResponse> = await analyzeProfileCallable({ imageBase64 });

      if (result.data && result.data.analysis) {
        setAnalysisResult(result.data.analysis);
        toast.success("Analysis complete!");
        // Log analyze_profile_success event
        analytics.then(analyticInstance => {
          if (analyticInstance) {
            logEvent(analyticInstance, 'analyze_profile_success');
          }
        });
      } else {
        throw new Error("Received no analysis from the AI.");
      }
    } catch (error: any) {
      console.error("Error calling analyzeProfile function:", error);
      toast.error(error.message || "Failed to analyze profile. Please try again.");
      // Log analyze_profile_failure event
      analytics.then(analyticInstance => {
        if (analyticInstance) {
          logEvent(analyticInstance, 'analyze_profile_failure', { error_message: error.message || 'Unknown error' });
        }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const copyToClipboard = () => {
    if (analysisResult) {
      navigator.clipboard.writeText(analysisResult);
      setCopied(true);
      toast.success("Analysis copied to clipboard!");
      setTimeout(() => setCopied(false), 2000); 
      // Log analysis_copied event
      analytics.then(analyticInstance => {
        if (analyticInstance) {
          logEvent(analyticInstance, 'analysis_copied', { feature: 'profile_analysis' });
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 pt-24 pb-16"
      >
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Rate My Profile</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your dating profile screenshot to get AI-powered feedback on what's working and how to improve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="mr-2 h-5 w-5 text-primary" />
                    Upload Your Profile Screenshot
                  </CardTitle>
                  <CardDescription>
                    Upload a screenshot (JPEG, PNG, WEBP, GIF, max 5MB)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ImageUploader
                    onImageUpload={handleImageUpload}
                    title="Upload Profile Screenshot"
                    description="Drag and drop your screenshot here, or click to browse"
                    acceptedFileTypes="image/jpeg, image/png, image/webp, image/gif"
                  />

                  <Button
                    className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
                    onClick={callAnalyzeProfileFunction}
                    disabled={!file || isAnalyzing || !user}
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                    ) : (
                      "Analyze My Profile"
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* How it works section */}
              <div className="mt-6 text-sm text-muted-foreground">
                 <p className="font-medium mb-2">
                   How it works:
                 </p>
                 <ul className="space-y-2">
                   <li className="flex items-start">
                     <span className="bg-primary/20 p-1 rounded-full mr-2 mt-0.5">
                       <Camera className="h-3.5 w-3.5 text-primary" />
                     </span>
                     <span>Upload a screenshot of your dating profile</span>
                   </li>
                   <li className="flex items-start">
                     <span className="bg-primary/20 p-1 rounded-full mr-2 mt-0.5">
                       <FileText className="h-3.5 w-3.5 text-primary" />
                     </span>
                     <span>Our AI analyzes your photos, bio, and prompts (using Vision)</span>
                   </li>
                   <li className="flex items-start">
                     <span className="bg-primary/20 p-1 rounded-full mr-2 mt-0.5">
                       <Clock className="h-3.5 w-3.5 text-primary" />
                     </span>
                     <span>Get detailed feedback and actionable suggestions</span>
                   </li>
                 </ul>
               </div>
            </div>

            {/* Results Section */}
            <div className="relative min-h-[300px]">
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center bg-muted/30 rounded-xl border border-dashed p-8 text-center"
                  >
                    <div>
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4 mx-auto" />
                      <h3 className="text-lg font-medium mb-2">Analyzing your profile...</h3>
                      <p className="text-muted-foreground">
                        This might take a moment.
                      </p>
                    </div>
                  </motion.div>
                )}
                {analysisResult && !isAnalyzing && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="border-primary/50">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                           <span>AI Analysis Result</span>
                           <Button
                             variant="ghost"
                             size="icon"
                             className="h-7 w-7 hover:bg-secondary/50 transition-colors duration-200"
                             onClick={copyToClipboard}
                             title="Copy Analysis"
                             disabled={!analysisResult}
                           >
                             {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                           </Button>
                        </CardTitle>
                        <CardDescription>Feedback generated by AI based on your screenshot.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none whitespace-pre-wrap bg-secondary/20 p-4 rounded-lg border border-secondary/30 max-h-[500px] overflow-y-auto">
                          {analysisResult}
                        </div>
                        <p className="mt-4 text-xs text-muted-foreground">
                          Note: This is AI-generated feedback. Consider it as suggestions and use your own judgment.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
                {!isAnalyzing && !analysisResult && (
                   <motion.div
                     key="placeholder"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.3 }}
                     className="absolute inset-0 flex items-center justify-center bg-muted/30 rounded-xl border border-dashed p-8 text-center"
                   >
                     <div>
                       <h3 className="text-lg font-medium mb-2">Your analysis will appear here</h3>
                       <p className="text-muted-foreground">
                         Upload a profile screenshot and click "Analyze My Profile" to get started.
                       </p>
                     </div>
                   </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
};

export default ProfileAnalysis;

