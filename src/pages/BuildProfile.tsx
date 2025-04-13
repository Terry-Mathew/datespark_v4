
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Heart, RefreshCw } from "lucide-react";

const BuildProfile = () => {
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBio, setGeneratedBio] = useState<string | null>(null);
  
  const handleSubmit = () => {
    if (userInput.length > 100) {
      toast.error("Please keep your input under 100 words");
      return;
    }
    
    if (!userInput.trim()) {
      toast.error("Please enter some information about yourself");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // Example generated bio based on input
      const exampleBio = userInput.includes("coffee") && userInput.includes("hiking") && userInput.includes("dog") 
        ? "Coffee's my spark, hiking's my escape, and my dog runs the show—join the adventure?" 
        : `As a ${userInput.includes("travel") ? "globetrotter" : "local explorer"} with a passion for ${
            userInput.includes("cooking") ? "culinary experiments" : "discovering new experiences"
          }, I'm all about authentic connections. ${
            userInput.includes("music") ? "My playlist is as eclectic as my life story" : "My weekends are mini-adventures waiting to happen"
          }. Let's skip the small talk and dive into what makes us tick.`;
      
      setGeneratedBio(exampleBio);
      setIsGenerating(false);
      toast.success("Bio generated successfully!");
    }, 2000);
  };
  
  const regenerateBio = () => {
    if (!userInput) {
      toast.error("Please enter some information first");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // Alternative bio example
      const alternativeBio = `${
        userInput.includes("funny") || userInput.includes("humor") ? "Warning: May cause spontaneous laughter. " : ""
      }Equal parts ${
        userInput.includes("book") || userInput.includes("read") ? "bookworm" : "adventurer"
      } and ${
        userInput.includes("food") || userInput.includes("cooking") ? "foodie" : "conversation enthusiast"
      }. I believe in genuine connections and ${
        userInput.includes("travel") ? "collecting passport stamps" : "creating memorable moments"
      }. Swipe right if you're up for ${
        userInput.includes("coffee") ? "coffee dates that turn into dinner" : "conversations that go beyond the weather"
      }.`;
      
      setGeneratedBio(alternativeBio);
      setIsGenerating(false);
      toast.success("New bio generated!");
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
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
                Enter a few details about your likes, pets, quirks, favorite foods, hobbies — whatever makes you, you!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="I like coffee, hiking, dogs..."
                className="min-h-[100px] resize-none"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                maxLength={400}
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {userInput.length}/100 words max
                </p>
                <Button 
                  className="bg-accent text-white hover:bg-accent/90" 
                  onClick={handleSubmit}
                  disabled={isGenerating}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  {isGenerating ? "Creating..." : "Create Bio"}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Results Section */}
          {generatedBio && (
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  Your Custom Bio
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2" 
                    onClick={regenerateBio}
                    disabled={isGenerating}
                  >
                    <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  </Button>
                </CardTitle>
                <CardDescription>
                  A witty, unique bio based on your input
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary/20 p-4 rounded-lg border border-secondary/30">
                  <p className="text-lg">{generatedBio}</p>
                </div>
                
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Why This Works:</h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Showcases your personality through vivid language</li>
                    <li>Creates intrigue with specific details from your input</li>
                    <li>Avoids dating profile clichés and generic phrases</li>
                    <li>Gives potential matches conversation starters</li>
                  </ul>
                  
                  <div className="flex justify-center mt-4">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Copy to Clipboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BuildProfile;
