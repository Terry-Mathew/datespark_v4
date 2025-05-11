import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Heart, RefreshCw, Copy, Check, Loader2 } from "lucide-react";
import { httpsCallable } from "firebase/functions";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { analytics, getFunctions } from "@/config/firebase"; // Import analytics and custom getFunctions

const functions = getFunctions();
const generateBioCallable = httpsCallable(functions, 'generateBio');

const BuildProfile = () => {
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBio, setGeneratedBio] = useState<string | null>(null);
  const [editableBio, setEditableBio] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  const callGenerateBioFunction = async () => {
    if (!user) {
      toast.error("Please sign in to generate a bio.");
      return;
    }
    if (!userInput.trim()) {
      toast.error("Please enter some information about yourself");
      return;
    }
    if (userInput.length > 500) {
      toast.error("Input text is too long. Please keep it under 500 characters.");
      return;
    }
    
    setIsGenerating(true);
    setGeneratedBio(null); 
    setEditableBio("");
    setCopied(false); 

    try {
      const result = await generateBioCallable({ userInput: userInput });
      const data = result.data as { bio: string }; 

      if (data && data.bio) {
        setGeneratedBio(data.bio);
        setEditableBio(data.bio);
        toast.success("Bio generated successfully!");
        // Log generate_bio_success event
        analytics.logEvent('generate_bio_success', {});
      } else {
        throw new Error("Received an unexpected response from the AI.");
      }
    } catch (error: Error | unknown) {
      console.error("Error calling generateBio function:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage || "Failed to generate bio. Please try again.");
      // Log generate_bio_failure event
      analytics.logEvent('generate_bio_failure', { 
        error_message: errorMessage || 'Unknown error' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    callGenerateBioFunction();
    // Log initial bio generation attempt
    analytics.logEvent('generate_bio_attempt', {});
  };

  const regenerateBio = () => {
    callGenerateBioFunction();
    // Log bio regeneration attempt
    analytics.logEvent('regenerate_bio_attempt', {});
  };

  const copyToClipboard = () => {
    if (editableBio) { 
      navigator.clipboard.writeText(editableBio);
      setCopied(true);
      toast.success("Bio copied to clipboard!");
      setTimeout(() => setCopied(false), 2000); 
      // Log bio_copied event
      analytics.logEvent('bio_copied', { feature: 'build_profile' });
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
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Build My Profile</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create a witty, unique dating profile bio that captures your personality and stands out from the crowd.
            </p>
          </div>
          
          {/* Input Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Tell Us About Yourself</CardTitle>
              <CardDescription>
                Enter a few details (up to 500 characters) about your likes, pets, quirks, hobbies — whatever makes you, you!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="I like coffee, hiking, dogs..."
                className="min-h-[100px] resize-none"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                maxLength={500} 
                disabled={isGenerating} 
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {userInput.length}/500 characters
                </p>
                <Button 
                  className="bg-accent text-white hover:bg-accent/90 transition-colors duration-200" 
                  onClick={handleSubmit}
                  disabled={isGenerating || !userInput.trim() || !user} 
                >
                  {isGenerating ? (
                     <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
                   ) : (
                     <><Heart className="mr-2 h-4 w-4" /> Create Bio</>
                   )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Results Section with Animation */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center p-8"
              >
                <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Generating your unique bio...</p>
              </motion.div>
            )}
            {generatedBio && !isGenerating && (
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
                      <span>Your Custom Bio</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={regenerateBio}
                        disabled={isGenerating || !userInput.trim() || !user} 
                        title="Regenerate Bio"
                        className="hover:bg-secondary/50 transition-colors duration-200"
                      >
                        <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      A witty, unique bio based on your input, generated by AI. You can edit it below.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-secondary/20 p-4 rounded-lg border border-secondary/30 relative">
                      <Textarea
                        value={editableBio}
                        onChange={(e) => setEditableBio(e.target.value)}
                        className="w-full min-h-[100px] resize-none border-0 bg-transparent focus:ring-0 p-0 text-lg"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 hover:bg-secondary/50 transition-colors duration-200"
                        onClick={copyToClipboard}
                        title="Copy Bio"
                      >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    <div className="text-center mt-4 text-sm text-muted-foreground">
                      Edit the bio above to perfectly match your voice before copying!
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default BuildProfile;

