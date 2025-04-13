import { useState } from "react";
import { MessageSquare, X, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sentiment, setSentiment] = useState<"positive" | "negative" | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the feedback to your backend
      // await fetch('/api/feedback', {
      //   method: 'POST',
      //   body: JSON.stringify({ sentiment, feedback }),
      // });

      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Thank you for your feedback!",
        description: "We appreciate your input and will use it to improve our service.",
      });

      // Reset form
      setSentiment(null);
      setFeedback("");
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full h-12 w-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary text-primary-foreground"
        size="icon"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>

      {/* Feedback Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Your Feedback</DialogTitle>
            <DialogDescription>
              Help us improve DateSpark by sharing your experience and suggestions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sentiment Selection */}
            <div className="space-y-4">
              <Label>How has your experience been with DateSpark?</Label>
              <RadioGroup
                value={sentiment || ""}
                onValueChange={(value) => setSentiment(value as "positive" | "negative")}
                className="flex justify-center gap-4"
              >
                <div className="flex flex-col items-center gap-2">
                  <RadioGroupItem
                    value="positive"
                    id="positive"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="positive"
                    className="flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer
                    peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-muted transition-all"
                  >
                    <ThumbsUp className="h-6 w-6 mb-2 text-primary" />
                    <span>Positive</span>
                  </Label>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <RadioGroupItem
                    value="negative"
                    id="negative"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="negative"
                    className="flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer
                    peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-muted transition-all"
                  >
                    <ThumbsDown className="h-6 w-6 mb-2 text-primary" />
                    <span>Needs Improvement</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Feedback Text */}
            <div className="space-y-2">
              <Label htmlFor="feedback">Your feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Share your thoughts, suggestions, or experience..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={!sentiment || !feedback || isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Submit Feedback"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeedbackWidget; 