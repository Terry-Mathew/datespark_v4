
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Copy, Check, Sparkles, RefreshCw } from "lucide-react";

interface PromptResponse {
  prompt: string;
  responses: string[];
}

const PromptPunchUp = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<PromptResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const examplePrompts = [
    "Two truths and a lie",
    "My perfect weekend",
    "The way to my heart",
    "My most controversial opinion",
    "I go crazy for",
  ];
  
  const handleSubmit = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // Example responses based on prompt
      let responses: string[] = [];
      
      if (prompt.toLowerCase().includes("weekend")) {
        responses = [
          "Convincing my plants I'm chill, burning toast artfully, and dodging spoilers online.",
          "Hiking until my fitness app thinks I'm lost, followed by ice cream to celebrate being found.",
          "Mornings with coffee and a book, afternoons with friends, evenings with no alarms set."
        ];
      } else if (prompt.toLowerCase().includes("truth") && prompt.toLowerCase().includes("lie")) {
        responses = [
          "I once won a karaoke contest with a Celine Dion song, I've eaten pizza in Naples, and I can speak fluent Japanese.",
          "I've been skydiving twice, I have seven houseplants named after celebrities, and I've never seen Star Wars.",
          "I was an extra in a Netflix show, I can cook 20+ pasta dishes from memory, and I once swam with sharks."
        ];
      } else if (prompt.toLowerCase().includes("heart")) {
        responses = [
          "Surprise me with obscure trivia and I'll be yours forever. Bonus points if it's about space or weird animals.",
          "Good food, bad puns, and remembering the little things I mention in passing.",
          "Send me song recommendations that match my vibe at 2 AM. I'm always listening."
        ];
      } else if (prompt.toLowerCase().includes("opinion") || prompt.toLowerCase().includes("controversial")) {
        responses = [
          "Movie theater popcorn is overrated. I bring my own snacks (stealthily, of course).",
          "Most meetings could be emails, most emails could be texts, and most texts could be ignored.",
          "I think cilantro tastes amazing and people who think it tastes like soap are missing out."
        ];
      } else if (prompt.toLowerCase().includes("crazy")) {
        responses = [
          "People who are passionate about literally anything. Tell me about your weird hobby for hours, please.",
          "The perfect breakfast burrito. I have a map of all the best spots within a 20-mile radius.",
          "Unexpected adventures. The best stories start with 'this wasn't the plan, but...'"
        ];
      } else {
        // Default responses for any other prompt
        responses = [
          `My ${prompt} game is strong enough to make even my mom double-tap.`,
          `If ${prompt} were an Olympic sport, I'd be bringing home gold. Or at least a participation medal.`,
          `My approach to ${prompt} is like my coffee: strong, surprising, and keeps you coming back for more.`
        ];
      }
      
      setResults({ prompt, responses });
      setIsGenerating(false);
      toast.success("Responses generated!");
    }, 2000);
  };
  
  const regenerateResponses = () => {
    if (!prompt) {
      toast.error("Please enter a prompt first");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // Alternative responses
      let responses: string[] = [];
      
      if (results) {
        // Generate alternative responses different from the current ones
        responses = [
          `When it comes to ${prompt}, I'm basically a professional... if professionals wing it and hope for the best.`,
          `My ${prompt} philosophy: life's too short for boring answers and bad coffee.`,
          `I approach ${prompt} like I approach cooking—creative chaos that somehow works out in the end.`
        ];
      }
      
      setResults({ prompt, responses });
      setIsGenerating(false);
      toast.success("New responses generated!");
    }, 2000);
  };
  
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };
  
  const selectExamplePrompt = (example: string) => {
    setPrompt(example);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Prompt Punch-Up</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Generate quirky, funny one-liners for your dating app prompts that will make you stand out.
            </p>
          </div>
          
          {/* Input Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Your Dating App Prompt</CardTitle>
              <CardDescription>
                Type a prompt like "Two truths and a lie" or "My perfect weekend"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter your prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              
              <div className="flex flex-wrap gap-2">
                <p className="text-sm text-muted-foreground mr-2 pt-1">Examples:</p>
                {examplePrompts.map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => selectExamplePrompt(example)}
                    className="text-xs"
                  >
                    {example}
                  </Button>
                ))}
              </div>
              
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
                onClick={handleSubmit}
                disabled={isGenerating}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Responses"}
              </Button>
            </CardContent>
          </Card>
          
          {/* Results Section */}
          {results && (
            <Card className="border-primary/50">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Your Punched-Up Responses</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={regenerateResponses}
                    disabled={isGenerating}
                  >
                    <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span className="ml-2">Refresh</span>
                  </Button>
                </div>
                <CardDescription>
                  For prompt: "{results.prompt}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.responses.map((response, index) => (
                    <div key={index} className="bg-secondary/20 p-4 rounded-lg border border-secondary/30 relative">
                      <p className="pr-10">{response}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-3 right-3"
                        onClick={() => copyToClipboard(response, index)}
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Pro Tips:</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>Personalize these responses to match your authentic voice</li>
                    <li>Choose the response that feels most natural to you</li>
                    <li>Specific details make your profile more memorable</li>
                    <li>Humor works best when it reflects your actual personality</li>
                  </ul>
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

export default PromptPunchUp;
