
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";
import ConversationStarter from "@/components/ConversationStarter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const sampleConversationStarters = [
  {
    message: "I noticed you're into hiking too! What's the most breathtaking trail you've been on? I recently conquered Mount Rainier and the views were absolutely life-changing.",
    category: "Shared Interest"
  },
  {
    message: "Your travel photos are amazing! That beach in your third pic looks familiar - is that in Thailand? I spent a month there last year and fell in love with the culture.",
    category: "Travel"
  },
  {
    message: "I see you're a fellow dog lover! Your golden retriever is adorable. What's their name? My rescue pup Luna has been my adventure buddy for 3 years now.",
    category: "Pets"
  },
  {
    message: "That restaurant in your profile pic looks fantastic! I'm always on the hunt for new foodie spots. Is it local? I'd love to hear your recommendations.",
    category: "Food & Dining"
  },
  {
    message: "Your playlist mentions some of my favorite bands! Have you listened to [band similar to ones they like]? Their new album reminds me a lot of [band they mentioned].",
    category: "Music"
  },
  {
    message: "I'm impressed by your rock climbing photos! I'm a beginner myself and just started bouldering. Any tips for someone just getting into the sport?",
    category: "Activities"
  }
];

const ConversationStarters = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [starters, setStarters] = useState<typeof sampleConversationStarters | null>(null);
  
  const handleImageUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setStarters(null); // Reset results when a new image is uploaded
  };
  
  const generateStarters = () => {
    if (!file) {
      toast.error("Please upload a screenshot of your crush's profile");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      setStarters(sampleConversationStarters);
      setIsGenerating(false);
      toast.success("Conversation starters generated!");
    }, 3000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Conversation Starters</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a screenshot of your crush's dating profile and get AI-generated conversation starters to help you break the ice.
            </p>
          </div>
          
          {/* Upload Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Upload Their Profile</CardTitle>
              <CardDescription>
                Share a screenshot of the profile you're interested in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUploader
                onImageUpload={handleImageUpload}
                title="Upload Profile Screenshot"
                description="Drag and drop a screenshot of their profile here, or click to browse"
              />
              
              <Button 
                className="w-full mt-4" 
                onClick={generateStarters} 
                disabled={!file || isGenerating}
              >
                {isGenerating ? "Generating Ideas..." : "Generate Conversation Starters"}
              </Button>
            </CardContent>
          </Card>
          
          {/* Results Section */}
          {isGenerating ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((_, index) => (
                <ConversationStarter 
                  key={index}
                  message=""
                  category=""
                  isLoading={true}
                />
              ))}
            </div>
          ) : starters ? (
            <>
              <h2 className="text-2xl font-bold mb-6">Your Personalized Conversation Starters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {starters.map((starter, index) => (
                  <ConversationStarter 
                    key={index}
                    message={starter.message}
                    category={starter.category}
                  />
                ))}
              </div>
              <div className="mt-8 bg-muted/30 rounded-lg p-4 border">
                <h3 className="font-medium mb-2">Pro Tips:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Personalize these starters further by adding your own experiences</li>
                  <li>Ask follow-up questions to keep the conversation flowing</li>
                  <li>Be authentic - don't copy messages that don't sound like you</li>
                  <li>Timing matters - aim to message when they're likely to be active</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-xl border border-dashed p-8 text-center">
              <div>
                <h3 className="text-lg font-medium mb-2">Your conversation starters will appear here</h3>
                <p className="text-muted-foreground">
                  Upload a screenshot and click "Generate Conversation Starters" to get started
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
