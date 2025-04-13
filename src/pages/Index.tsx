
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/FeatureCard";
import TestimonialCard from "@/components/TestimonialCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, MessageCircle, Camera, Heart, Sparkles, Users, Edit, Zap } from "lucide-react";

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
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="text-lg"
              onClick={() => navigate("/profile-analysis")}
            >
              <Camera className="mr-2 h-5 w-5" />
              Analyze My Profile
            </Button>
            <Button 
              size="lg" 
              className="text-lg bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => navigate("/build-profile")}
            >
              <Edit className="mr-2 h-5 w-5" />
              Build My Profile
            </Button>
            <Button 
              size="lg" 
              className="text-lg bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate("/prompt-punch-up")}
            >
              <Zap className="mr-2 h-5 w-5" />
              Prompt Punch-Up
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
              DateSpark uses advanced AI to help you stand out in the dating world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Camera}
              title="Upload Your Profile"
              description="Share your dating profile photos and get personalized feedback on how to improve them."
            />
            <FeatureCard
              icon={Edit}
              title="Build Your Bio"
              description="Create a witty, unique dating profile bio that captures your personality in seconds."
            />
            <FeatureCard
              icon={Zap}
              title="Punch Up Your Prompts"
              description="Generate quirky, funny one-liners for your dating app prompts that will make you stand out."
            />
            <FeatureCard
              icon={Sparkles}
              title="AI Analysis"
              description="Our AI analyzes your photos and provides specific suggestions to make your profile more attractive."
            />
            <FeatureCard
              icon={MessageCircle}
              title="Get Conversation Starters"
              description="Receive tailored conversation starters based on their interests and profile content."
            />
            <FeatureCard
              icon={Heart}
              title="Find Better Matches"
              description="With an optimized profile, you'll attract more quality matches and meaningful connections."
            />
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 md:py-24 container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from people who've improved their dating lives with DateSpark.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard 
            quote="I was struggling to get matches until I used the profile analysis. The suggestions were spot on and my matches increased by 300%!"
            author="Alex, 28"
            image="https://source.unsplash.com/random/100x100/?portrait,man"
          />
          <TestimonialCard 
            quote="The bio generator created a profile that actually sounds like me! It helped me showcase my personality in a way I couldn't do myself."
            author="Emma, 24"
            image="https://source.unsplash.com/random/100x100/?portrait,woman"
          />
          <TestimonialCard 
            quote="The prompt punch-up feature gave me hilarious responses that got people messaging me first. Game changer!"
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
              Join thousands of people who are finding better matches and making meaningful connections with DateSpark.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg"
                onClick={() => navigate("/profile-analysis")}
              >
                Analyze My Profile
              </Button>
              <Button 
                size="lg" 
                className="text-lg bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => navigate("/build-profile")}
              >
                Build My Profile
              </Button>
              <Button 
                size="lg" 
                className="text-lg bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate("/prompt-punch-up")}
              >
                Prompt Punch-Up
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
