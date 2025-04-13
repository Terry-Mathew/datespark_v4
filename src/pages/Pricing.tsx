import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PricingTier = ({ 
  title, 
  price, 
  description, 
  features, 
  buttonText, 
  isPremium = false 
}: { 
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  isPremium?: boolean;
}) => (
  <Card className={`flex flex-col ${isPremium ? 'border-primary' : ''}`}>
    <CardHeader>
      <CardTitle className="text-2xl">{title}</CardTitle>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold">{price}</span>
        {price !== "Free" && <span className="text-muted-foreground">/month</span>}
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-1 flex flex-col">
      <ul className="space-y-2 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        className={`mt-6 ${isPremium ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
        variant={isPremium ? 'default' : 'outline'}
      >
        {buttonText}
      </Button>
    </CardContent>
  </Card>
);

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-lg text-muted-foreground">
            Start with our free tier or unlock all features with Premium
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <PricingTier
            title="Free"
            price="Free"
            description="Perfect for trying out DateSpark"
            features={[
              "1 Profile Analysis per week",
              "Match Potential Score",
              "Profile Picture Feedback",
              "Basic Improvement Suggestions"
            ]}
            buttonText="Get Started"
          />
          
          <PricingTier
            title="Premium"
            price="₹199"
            description="Full access to all premium features"
            features={[
              "40 Profile Analyses",
              "50 Personalized Bio Generations",
              "Unlimited Prompt Punch-Ups",
              "Unlimited Conversation Starters",
              "Priority Support",
              "Advanced Analytics"
            ]}
            buttonText="Upgrade to Premium"
            isPremium
          />
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto text-left grid gap-6">
            <div>
              <h3 className="font-medium mb-2">Can I cancel my subscription at any time?</h3>
              <p className="text-muted-foreground">Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">We accept all major credit cards and PayPal.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Is my data secure?</h3>
              <p className="text-muted-foreground">Yes, we take data security seriously. All your data is encrypted and we never share your personal information.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing; 