// src/pages/ProfileAnalysis.tsx (or wherever it is)
import { useState, useEffect } from "react"; // Added useEffect
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Camera, FileText, Clock, Loader2, Copy, Check } from "lucide-react";
import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { analytics, getFunctions, auth } from "@/config/firebase";
import { logEvent } from "firebase/analytics";

interface AnalyzeProfileResponse {
  analysis: string;
}

const firebaseFunctions = getFunctions(); 
console.log("Firebase Functions initialized");

const analyzeProfileCallable = httpsCallable<
  { imageBase64: string },
  AnalyzeProfileResponse
>(firebaseFunctions, "analyzeProfilePhotos");

// Add a direct HTTP call option as backup
const callAtURL = async (url: string, data: any, token?: string) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  console.log("Calling API with token:", token ? "Token present" : "No token");
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data }),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  const result = await response.json();
  return result;
};

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
  // Changed to store an array of files
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); 
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  // Update handleImageUpload to accept File[] and store valid files
  const handleImageUpload = (uploadedFiles: File[] | null) => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      setSelectedFiles([]);
      setAnalysisResult(null);
      return;
    }

    const validFiles: File[] = [];

    for (const uploadedFile of uploadedFiles) {
      // More lenient check for image files
      if (!uploadedFile.type.startsWith("image/")) {
        toast.error(
          `File "${uploadedFile.name}" is not a valid image. Please upload JPEG, PNG, WEBP, or GIF.`
        );
        continue;
      }
      
      if (uploadedFile.size > 5 * 1024 * 1024) {
        toast.error(
          `File "${uploadedFile.name}" is too large. Please upload images under 5MB.`
        );
        continue;
      }
      
      validFiles.push(uploadedFile);
    }
    
    // Log the valid files we received
    console.log("Valid files accepted:", validFiles.map(f => f.name));
    
    setSelectedFiles(validFiles);
    setAnalysisResult(null); // Clear previous analysis when new files are selected

    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} image${validFiles.length > 1 ? 's' : ''} uploaded successfully`);
      analytics.logEvent('images_uploaded', {
        feature: 'profile_analysis',
        count: validFiles.length,
      });
    } else {
      toast.error("No valid images were uploaded. Please try again.");
    }
  };

  const callAnalyzeProfileFunction = async () => {
    if (!user) {
      toast.error("Please sign in to analyze your profile.");
      return;
    }
    // Check if there are any selected files
    if (selectedFiles.length === 0) {
      toast.error("Please upload at least one image of your dating profile screenshot.");
      return;
    }

    // For now, we analyze the FIRST file in the list.
    const fileToAnalyze = selectedFiles[0];

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setCopied(false);
    analytics.logEvent('analyze_profile_attempt', { file_count: 1 });

    try {
      const imageBase64 = await fileToBase64(fileToAnalyze);
      
      // Get auth token first to ensure we have it for both attempts
      const idToken = auth.currentUser ? await auth.currentUser.getIdToken(true) : undefined;
      if (!idToken) {
        toast.error("Authentication required. Please sign in again.");
        setIsAnalyzing(false);
        return;
      }
      
      console.log("Processing request for image:", fileToAnalyze.name);
      
      // Try the Firebase callable function first
      let result: any;
      try {
        console.log("Calling Firebase function via httpsCallable...");
        const callableResult = await analyzeProfileCallable({ imageBase64 });
        result = callableResult;
        console.log("Firebase callable success");
      } catch (callableError) {
        console.warn("Firebase callable failed, trying direct API call:", callableError);
        
        // Fall back to direct HTTP call to the CORS proxy
        const proxyResponse = await callAtURL(
          "http://localhost:3000/analyzeProfilePhotos",
          { imageBase64 },
          idToken
        );
        
        // Handle the response format based on what we get back
        if (proxyResponse.result) {
          result = { data: proxyResponse.result };
        } else {
          result = proxyResponse;
        }
        console.log("Direct API call success");
      }

      // Safely extract the analysis from various response formats
      let analysis = null;
      if (result?.data?.analysis) {
        analysis = result.data.analysis;
      } else if (result?.analysis) {
        analysis = result.analysis;
      }

      if (analysis) {
        setAnalysisResult(analysis);
        toast.success("Analysis complete for " + fileToAnalyze.name + "!");
        analytics.logEvent('analyze_profile_success', {});
      } else {
        console.error("No analysis found in response:", result);
        throw new Error("Received no analysis from the AI.");
      }
    } catch (error: Error | unknown) {
      console.error("Error calling analyzeProfile function:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(
        errorMessage || "Failed to analyze profile for " + fileToAnalyze.name + ". Please try again."
      );
      analytics.logEvent('analyze_profile_failure', {
        error_message: errorMessage || "Unknown error",
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
      analytics.logEvent('analysis_copied', {
        feature: 'profile_analysis',
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
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Rate My Profile
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload one or more screenshots of your dating profile to get AI-powered feedback.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="mr-2 h-5 w-5 text-primary" />
                    Upload Profile Screenshot(s)
                  </CardTitle>
                  <CardDescription>
                    Upload screenshots (JPEG, PNG, WEBP, GIF, max 5MB each)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ImageUploader
                    onImageUpload={handleImageUpload}
                    title="Upload Profile Screenshot(s)"
                    description="Drag and drop your screenshots here, or click to browse"
                    acceptedTypes="image/jpeg, image/png, image/webp, image/gif"
                  />
                  <Button
                    className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
                    onClick={callAnalyzeProfileFunction}
                    // Updated disabled condition
                    disabled={selectedFiles.length === 0 || isAnalyzing || !user} 
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                    ) : selectedFiles.length > 0 ? (
                      // Clear text showing which file is selected
                      `Analyze Profile (${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''} selected)` 
                    ) : (
                      "Analyze Profile"
                    )}
                  </Button>
                  {selectedFiles.length > 0 && (
                    <div className="mt-3 text-sm text-muted-foreground">
                      <p className="font-medium">Selected file{selectedFiles.length > 1 ? 's' : ''}:</p>
                      <ul className="list-disc list-inside mt-1">
                        {selectedFiles.map((file, index) => (
                          <li key={index} className="truncate">{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
              <div className="mt-6 text-sm text-muted-foreground">
                 <p className="font-medium mb-2">How it works:</p>
                 <ul className="space-y-2">
                   <li className="flex items-start">
                     <span className="bg-primary/20 p-1 rounded-full mr-2 mt-0.5">
                       <Camera className="h-3.5 w-3.5 text-primary" />
                     </span>
                     <span>Upload one or more screenshots of your dating profile</span>
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
                     <span>Get detailed feedback and actionable suggestions for the selected image</span>
                   </li>
                 </ul>
               </div>
            </div>

            <div className="relative min-h-[300px]">
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div /* ... loading animation ... */ className="absolute inset-0 flex items-center justify-center bg-muted/30 rounded-xl border border-dashed p-8 text-center">
                     <div>
                       <Loader2 className="h-8 w-8 animate-spin text-primary mb-4 mx-auto" />
                       <h3 className="text-lg font-medium mb-2">Analyzing your profile...</h3>
                       <p className="text-muted-foreground">This might take a moment.</p>
                     </div>
                  </motion.div>
                )}
                {analysisResult && !isAnalyzing && (
                  <motion.div /* ... result display ... */ key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                    <Card className="border-primary/50">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                           <span>AI Analysis Result</span>
                           <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-secondary/50 transition-colors duration-200" onClick={copyToClipboard} title="Copy Analysis" disabled={!analysisResult}>
                             {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                           </Button>
                        </CardTitle>
                        <CardDescription>Feedback generated by AI for the selected screenshot.</CardDescription>
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
                   <motion.div /* ... placeholder ... */ key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 flex items-center justify-center bg-muted/30 rounded-xl border border-dashed p-8 text-center">
                     <div>
                       <h3 className="text-lg font-medium mb-2">Your analysis will appear here</h3>
                       <p className="text-muted-foreground">
                         Upload profile screenshot(s) and click "Analyze Profile" to get started.
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
