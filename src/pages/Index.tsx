
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/FeatureCard";
import TestimonialCard from "@/components/TestimonialCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, MessageCircle, Camera, Heart, Sparkles, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 container">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Optimize Your <span className="text-primary">Dating Profile</span> with AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get AI-powered feedback on your profile photos and learn the perfect conversation starters to match with your crush.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg"
              onClick={() => navigate("/profile-analysis")}
            >
              <Upload className="mr-2 h-5 w-5" />
              Analyze My Profile
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg"
              onClick={() => navigate("/conversation-starters")}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Get Conversation Starters
            </Button>
          </div>
        </div>
      </section>
      
      {/* Feature Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              DateWhisperer uses advanced AI to help you stand out in the dating world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Camera}
              title="Upload Your Profile"
              description="Share your dating profile photos and get personalized feedback on how to improve them."
            />
            <FeatureCard
              icon={Sparkles}
              title="AI Analysis"
              description="Our AI analyzes your photos and provides specific suggestions to make your profile more attractive."
            />
            <FeatureCard
              icon={Heart}
              title="Find Better Matches"
              description="With an optimized profile, you'll attract more quality matches and meaningful connections."
            />
            <FeatureCard
              icon={Upload}
              title="Share Their Profile"
              description="Upload a screenshot of your crush's profile to understand them better."
            />
            <FeatureCard
              icon={MessageCircle}
              title="Get Conversation Starters"
              description="Receive tailored conversation starters based on their interests and profile content."
            />
            <FeatureCard
              icon={Users}
              title="Make Meaningful Connections"
              description="Break the ice with confidence and build genuine connections from the start."
            />
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 md:py-24 container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from people who've improved their dating lives with DateWhisperer.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard 
            quote="I was struggling to get matches until I used the profile analysis. The suggestions were spot on and my matches increased by 300%!"
            author="Alex, 28"
            image="https://source.unsplash.com/random/100x100/?portrait,man"
          />
          <TestimonialCard 
            quote="The conversation starters were a game-changer. Instead of the usual 'hey', I had meaningful conversations that actually led to dates."
            author="Emma, 24"
            image="https://source.unsplash.com/random/100x100/?portrait,woman"
          />
          <TestimonialCard 
            quote="I was skeptical at first, but the AI gave me insights about my profile I never would have noticed. Now I'm dating someone amazing!"
            author="Michael, 32"
            image="https://source.unsplash.com/random/100x100/?portrait,man2"
          />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/10 relative overflow-hidden">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Dating Life?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of people who are finding better matches and making meaningful connections with DateWhisperer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg"
                onClick={() => navigate("/profile-analysis")}
              >
                Analyze My Profile
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg"
                onClick={() => navigate("/conversation-starters")}
              >
                Get Conversation Starters
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-primary/5 animate-float"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-primary/10 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-secondary/20 animate-float" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
