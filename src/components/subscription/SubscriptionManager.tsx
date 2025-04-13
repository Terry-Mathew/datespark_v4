import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const SubscriptionManager = () => {
  const { user, updateSubscription } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      // In a real app, integrate with a payment provider like Stripe
      await updateSubscription(true);
      toast.success("Successfully subscribed to premium!");
    } catch (error) {
      toast.error("Failed to process subscription");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      setIsLoading(true);
      await updateSubscription(false);
      toast.success("Subscription cancelled");
    } catch (error) {
      toast.error("Failed to cancel subscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Subscription Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                {user?.isPremium ? "Premium Plan" : "Free Plan"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {user?.isPremium 
                  ? "You have access to all premium features" 
                  : "Upgrade to access premium features"}
              </p>
            </div>
            <Button
              onClick={user?.isPremium ? handleUnsubscribe : handleSubscribe}
              disabled={isLoading}
              variant={user?.isPremium ? "outline" : "default"}
            >
              {isLoading 
                ? "Processing..." 
                : user?.isPremium 
                  ? "Cancel Subscription" 
                  : "Upgrade to Premium"}
            </Button>
          </div>

          {user?.isPremium && (
            <div className="mt-6 border-t pt-4">
              <h4 className="font-medium mb-2">Premium Benefits</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>40 Profile Analyses per month</li>
                <li>50 Personalized Bio Generations</li>
                <li>Unlimited Prompt Punch-Ups</li>
                <li>Unlimited Conversation Starters</li>
                <li>Priority Support</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionManager; 