import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { MessageCircle, Loader2, Copy, Check } from "lucide-react";
import { getFunctions, httpsCallable, HttpsCallableResult } from "firebase/functions";
import { useAuth } from "@/contexts/AuthContext";
import { analytics } from "@/config/firebase"; // Import analytics
import { logEvent } from "firebase/analytics"; // Import logEvent

interface GenerateStartersResponse {
  starters: string[];
}

const functions = getFunctions();
const generateConversationStartersCallable = httpsCallable<
  { imageBase64: string }, 
  GenerateStartersResponse
>(functions, 'generateConversationStarters');

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const ConversationStarters = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [starterMessages, setStarterMessages] = useState<string[] | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
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
    setStarterMessages(null);
    // Log image_uploaded event
    analytics.then(analyticInstance => {
      if (analyticInstance) {
        logEvent(analyticInstance, 'image_uploaded', { feature: 'conversation_starters', file_type: uploadedFile.type, file_size: uploadedFile.size });
      }
    });
  };

  const callGenerateStartersFunction = async () => {
    if (!user) {
      toast.error("Please sign in to generate conversation starters.");
      return;
    }
    if (!file) {
      toast.error("Please upload a screenshot of the profile.");
      return;
    }

    setIsGenerating(true);
    setStarterMessages(null);
    setCopiedIndex(null);
    // Log generate_starters_attempt event
    analytics.then(analyticInstance => {
      if (analyticInstance) {
        logEvent(analyticInstance, 'generate_starters_attempt');
      }
    });

    try {
      const imageBase64 = await fileToBase64(file);
      const result: HttpsCallableResult<GenerateStartersResponse> = await generateConversationStartersCallable({ imageBase64 });

      if (result.data && result.data.starters && result.data.starters.length > 0) {
        setStarterMessages(result.data.starters);
        toast.success("Conversation starters generated!");
        // Log generate_starters_success event
        analytics.then(analyticInstance => {
          if (analyticInstance) {
            logEvent(analyticInstance, 'generate_starters_success');
          }
        });
      } else {
        throw new Error("Received no conversation starters from the AI.");
      }
    } catch (error: any) {
      console.error("Error calling generateConversationStarters function:", error);
      toast.error(error.message || "Failed to generate starters. Please try again.");
      // Log generate_starters_failure event
      analytics.then(analyticInstance => {
        if (analyticInstance) {
          logEvent(analyticInstance, 'generate_starters_failure', { error_message: error.message || 'Unknown error' });
        }
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    // Log starter_copied event
    analytics.then(analyticInstance => {
      if (analyticInstance) {
        logEvent(analyticInstance, 'starter_copied', { feature: 'conversation_starters', index });
      }
    });

    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Help Me Message Someone</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a screenshot of their dating profile and get personalized conversation starters to help you break the ice.
            </p>
          </div>

          {/* Upload Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-primary" />
                Upload Their Profile Screenshot
              </CardTitle>
              <CardDescription>
                Share a screenshot (JPEG, PNG, WEBP, GIF, max 5MB) of the profile you're interested in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUploader
                onImageUpload={handleImageUpload}
                title="Upload Profile Screenshot"
                description="Make sure the bio and prompts are clearly visible"
                acceptedFileTypes="image/jpeg, image/png, image/webp, image/gif"
              />

              <Button
                className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={callGenerateStartersFunction}
                disabled={!file || isGenerating || !user}
              >
                {isGenerating ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Ideas...</>
                ) : (
                  "Generate Conversation Starters"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          {isGenerating ? (
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-xl border border-dashed p-8 text-center">
               <div>
                 <Loader2 className="h-8 w-8 animate-spin text-primary mb-4 mx-auto" />
                 <h3 className="text-lg font-medium mb-2">Generating starters...</h3>
                 <p className="text-muted-foreground">
                   This might take a moment.
                 </p>
               </div>
             </div>
          ) : starterMessages ? (
            <>
              <h2 className="text-2xl font-bold mb-6">Your Conversation Starters</h2>
              <div className="space-y-4">
                {starterMessages.map((starter, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="py-4">
                      <div className="flex justify-between items-start">
                        <p className="pr-10">{starter}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 flex-shrink-0"
                          onClick={() => copyToClipboard(starter, index)}
                          title="Copy Starter"
                        >
                          {copiedIndex === index ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 bg-muted/30 rounded-lg p-4 border">
                <h3 className="font-medium mb-2">Pro Tips:</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Personalize these starters further by adding your own voice</li>
                  <li>Choose the message style that feels most natural to you</li>
                  <li>Ask follow-up questions to keep the conversation flowing</li>
                  <li>Be authentic - don't copy messages that don't sound like you</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-xl border border-dashed p-8 text-center">
              <div>
                <h3 className="text-lg font-medium mb-2">Your conversation starters will appear here</h3>
                <p className="text-muted-foreground">
                  Upload a screenshot and click "Generate Conversation Starters" to get started.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConversationStarters;

