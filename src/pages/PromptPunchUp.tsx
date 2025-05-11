import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Copy, Check, Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { analytics, getFunctions } from "@/config/firebase"; // Import analytics and custom getFunctions

interface GeneratePromptsResponse {
  responses: string[];
}

const functions = getFunctions();
const generatePromptsCallable = httpsCallable<{
  prompt: string;
  tone?: string;
  culturalContext?: string;
}, GeneratePromptsResponse>(functions, 'generatePrompts');

const PromptPunchUp = () => {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("witty");
  const [culturalContext, setCulturalContext] = useState("general");
  const [isGenerating, setIsGenerating] = useState(false);
  const [editableResponses, setEditableResponses] = useState<string[] | null>(null);
  const [originalPrompt, setOriginalPrompt] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { user } = useAuth();

  const examplePrompts = [
    "Two truths and a lie",
    "My perfect weekend",
    "The way to my heart",
    "My most controversial opinion",
    "I go crazy for",
  ];

  const availableTones = ["witty", "flirty", "sincere", "funny", "thoughtful"];
  const availableContexts = ["general", "Indian", "American", "British"];

  const callGeneratePromptsFunction = async () => {
    if (!user) {
      toast.error("Please sign in to generate responses.");
      return;
    }
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    if (prompt.length > 200) {
      toast.error("Prompt text is too long. Please keep it under 200 characters.");
      return;
    }

    setIsGenerating(true);
    setEditableResponses(null);
    setOriginalPrompt(prompt);
    setCopiedIndex(null);

    try {
      const result: HttpsCallableResult<GeneratePromptsResponse> = await generatePromptsCallable({
        prompt: prompt,
        tone: tone,
        culturalContext: culturalContext,
      });

      if (result.data && result.data.responses && result.data.responses.length > 0) {
        setEditableResponses(result.data.responses);
        toast.success("Responses generated!");
        // Log generate_prompts_success event
        analytics.logEvent('generate_prompts_success', { 
          tone, 
          cultural_context: culturalContext 
        });
      } else {
        throw new Error("Received no responses from the AI.");
      }
    } catch (error: Error | unknown) {
      console.error("Error calling generatePrompts function:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage || "Failed to generate responses. Please try again.");
      // Log generate_prompts_failure event
      analytics.logEvent('generate_prompts_failure', { 
        tone, 
        cultural_context: culturalContext, 
        error_message: errorMessage || 'Unknown error' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    callGeneratePromptsFunction();
    // Log initial prompt generation attempt
    analytics.logEvent('generate_prompts_attempt', { 
      tone, 
      cultural_context: culturalContext 
    });
  };

  const regenerateResponses = () => {
    if (!originalPrompt) {
        toast.error("No prompt was previously generated for.");
        return;
    }
    callGeneratePromptsFunction(); 
    // Log prompt regeneration attempt
    analytics.logEvent('regenerate_prompts_attempt', { 
      tone, 
      cultural_context: culturalContext 
    });
  };

  const handleResponseChange = (index: number, value: string) => {
    if (editableResponses) {
      const updatedResponses = [...editableResponses];
      updatedResponses[index] = value;
      setEditableResponses(updatedResponses);
    }
  };

  const copyToClipboard = (index: number) => {
    if (editableResponses && editableResponses[index]) {
      navigator.clipboard.writeText(editableResponses[index]);
      setCopiedIndex(index);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedIndex(null), 2000);
      // Log prompt_response_copied event
      analytics.logEvent('prompt_response_copied', { index });
    }
  };

  const selectExamplePrompt = (example: string) => {
    setPrompt(example);
    // Log example_prompt_selected event
    analytics.logEvent('example_prompt_selected', { prompt_text: example });
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
                Type a prompt (max 200 chars) like "Two truths and a lie" or "My perfect weekend"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter your prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={200}
                disabled={isGenerating}
              />

              {/* Example Prompts */}
              <div className="flex flex-wrap gap-2">
                <p className="text-sm text-muted-foreground mr-2 pt-1">Examples:</p>
                {examplePrompts.map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => selectExamplePrompt(example)}
                    className="text-xs hover:bg-secondary/50 transition-colors duration-200"
                    disabled={isGenerating}
                  >
                    {example}
                  </Button>
                ))}
              </div>

              {/* Tone and Context Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tone-select" className="text-sm font-medium">Tone</label>
                  <Select value={tone} onValueChange={setTone} disabled={isGenerating}>
                    <SelectTrigger id="tone-select">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTones.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="context-select" className="text-sm font-medium">Cultural Context</label>
                  <Select value={culturalContext} onValueChange={setCulturalContext} disabled={isGenerating}>
                    <SelectTrigger id="context-select">
                      <SelectValue placeholder="Select context" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableContexts.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
                onClick={handleSubmit}
                disabled={isGenerating || !prompt.trim() || !user}
              >
                {isGenerating ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Generate Responses</>
                )}
              </Button>
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
                <p className="text-muted-foreground">Generating responses...</p>
              </motion.div>
            )}
            {editableResponses && !isGenerating && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-primary/50">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Your Punched-Up Responses</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={regenerateResponses}
                        disabled={isGenerating || !originalPrompt || !user}
                        title="Regenerate Responses"
                        className="hover:bg-secondary/50 transition-colors duration-200"
                      >
                        <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                        <span className="ml-2">Refresh</span>
                      </Button>
                    </div>
                    <CardDescription>
                      For prompt: "{originalPrompt}" (Tone: {tone}, Context: {culturalContext}). Edit below before copying.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {editableResponses.map((response, index) => (
                        <div key={index} className="bg-secondary/20 p-4 rounded-lg border border-secondary/30 relative">
                          <Textarea
                            value={response}
                            onChange={(e) => handleResponseChange(index, e.target.value)}
                            className="w-full min-h-[60px] resize-none border-0 bg-transparent focus:ring-0 p-0 pr-10"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7 hover:bg-secondary/50 transition-colors duration-200"
                            onClick={() => copyToClipboard(index)}
                            title="Copy Response"
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

                    <div className="mt-6 bg-muted/30 p-4 rounded-lg border">
                      <h3 className="font-semibold mb-2">Pro Tips:</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
                        <li>Personalize these responses to match your authentic voice</li>
                        <li>Choose the response that feels most natural to you</li>
                        <li>Specific details make your profile more memorable</li>
                        <li>Humor works best when it reflects your actual personality</li>
                      </ul>
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

export default PromptPunchUp;

