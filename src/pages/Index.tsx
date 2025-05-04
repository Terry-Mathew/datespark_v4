import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
// Remove the duplicate FeatureCard definition
// import FeatureCard from "@/components/FeatureCard"; // Use the imported FeatureCard
import FeatureCard from "@/components/FeatureCard"; // Import the actual component
// Remove TestimonialCard import if Testimonials component is used
// import TestimonialCard from "@/components/TestimonialCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Import the Testimonials component
import Testimonials from "@/components/Testimonials"; 
import { Upload, MessageCircle, Camera, Heart, Sparkles, Users, Edit, Zap, MessageSquare, Star, PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import ScrollFadeIn from "@/components/ScrollFadeIn";

// Remove the duplicate FeatureCard definition from here
/*
const FeatureCard = ({ icon: Icon, title, description, className }: {
  icon: any;
  title: string;
  description: string;
  className?: string;
}) => (
  // ... implementation ...
);
*/

const ProcessCard = ({ 
  icon: Icon, 
  title, 
  description, 
  iconPosition = 'left' 
}: { 
  icon: any;
  title: string;
  description: string;
  iconPosition?: 'left' | 'right';
}) => (
  <div className="p-6 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow">
    <div className={`flex items-start gap-6 ${iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="flex-shrink-0">
        <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100">
          <Icon className="h-8 w-8 text-primary" /> {/* Increased icon size by 20% */}
        </div>
      </div>
      <div className={`flex-1 ${iconPosition === 'right' ? 'text-right' : 'text-left'}`}>
        <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16"> {/* Add padding-top to account for fixed navbar */}
        {/* Hero Section */}
        <section className="relative py-12 md:py-24 overflow-hidden bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-[85rem] mx-auto">
              {/* Main Headline */}
              <h1 className="text-[32px] md:text-[48px] font-bold tracking-tight leading-tight mb-4 md:mb-6">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Find Your Perfect Match
                </span>
              </h1>
              
              {/* Subheadline */}
              <h2 className="text-xl md:text-[24px] font-semibold text-foreground/90 max-w-3xl mx-auto mb-4">
                Transform Your Dating Profile and Attract Better Matches with AI-Powered Insights
              </h2>
              
              {/* Lead Text */}
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-12 px-4">
                Get personalized insights, engaging bios, and conversation starters that make you stand out.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 mb-8 md:mb-16">
                {/* Primary CTA */}
                <div className="w-full sm:w-auto">
                  <Link to="/profile-analysis" className="block">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto px-6 py-6 text-base md:text-lg bg-secondary 
                      hover:bg-[#D93D66] text-white shadow-xl hover:shadow-2xl 
                      hover:shadow-secondary/30 transform hover:-translate-y-0.5 
                      transition-all duration-300"
                    >
                      <Camera className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />
                      Analyze My Photos
                    </Button>
                  </Link>
                </div>

                {/* Secondary CTA */}
                <div className="w-full sm:w-auto">
                  <Link to="/how-it-works" className="block">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto px-6 py-6 text-base md:text-lg 
                      border-secondary/30 text-secondary hover:bg-secondary/10 
                      hover:border-secondary/50 transition-all duration-300"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex justify-center px-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                bg-background border border-muted-foreground/20 shadow-sm text-sm">
                  <svg className="h-4 w-4 md:h-5 md:w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm md:text-base font-medium">Free Analysis • No Credit Card Required</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid - Updated to 4 columns */}
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            {/* Make this a 4-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {/* Add Profile Analysis Card */}
              <Link to="/profile-analysis">
                <FeatureCard
                  icon={Camera} 
                  title="Profile Analysis"
                  description="Get AI-powered feedback on your photos to improve your profile's appeal."
                  className="cursor-pointer"
                />
              </Link>
              
              <Link to="/build-profile">
                <FeatureCard
                  icon={Heart}
                  title="Build My Profile"
                  description="Create an engaging bio that captures attention and shows your authentic self."
                  className="cursor-pointer"
                />
              </Link>
              
              <Link to="/prompt-punch-up">
                <FeatureCard
                  icon={Zap}
                  title="Prompt Punch-Up"
                  description="Craft standout prompt responses that spark meaningful conversations."
                  className="cursor-pointer"
                />
              </Link>
              
              <Link to="/conversation-starters">
                <FeatureCard
                  icon={MessageSquare}
                  title="Conversation Starters"
                  description="Get personalized opening messages that lead to real connections."
                  className="cursor-pointer"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              <div className="text-center group">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary mb-1 group-hover:scale-105 transition-transform duration-300">
                  50K+
                </div>
                <div className="text-sm text-muted-foreground">
                  Profiles Analyzed
                </div>
              </div>

              <div className="text-center group">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-colors duration-300">
                    <Heart className="h-6 w-6 text-secondary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-secondary mb-1 group-hover:scale-105 transition-transform duration-300">
                  85%
                </div>
                <div className="text-sm text-muted-foreground">
                  Match Rate Increase
                </div>
              </div>

              <div className="text-center group">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                    <Star className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-accent mb-1 group-hover:scale-105 transition-transform duration-300">
                  4.9/5
                </div>
                <div className="text-sm text-muted-foreground">
                  User Rating
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-20 mt-10 bg-gradient-to-b from-background to-gray-50/50">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                DateSpark uses advanced AI to help you stand out in the dating world.
              </p>
            </div>

            <div className="grid gap-6">
              <ProcessCard
                icon={Camera}
                title="Upload Your Profile"
                description="Share your dating profile photos and get personalized feedback on how to improve them."
                iconPosition="left"
              />
              
              <ProcessCard
                icon={PenLine}
                title="Build Your Bio"
                description="Create a witty, unique dating profile bio that captures your personality in seconds."
                iconPosition="right"
              />
              
              <ProcessCard
                icon={Zap}
                title="Punch Up Your Prompts"
                description="Generate quirky, funny one-liners for your dating app prompts that will make you stand out."
                iconPosition="left"
              />
              
              <ProcessCard
                icon={Sparkles}
                title="AI Analysis"
                description="Our AI analyzes your photos and provides specific suggestions to make your profile more attractive."
                iconPosition="right"
              />
              
              <ProcessCard
                icon={MessageSquare}
                title="Get Conversation Starters"
                description="Receive tailored conversation starters based on their interests and profile content."
                iconPosition="left"
              />
              
              <ProcessCard
                icon={Heart}
                title="Find Better Matches"
                description="With an optimized profile, you'll attract more quality matches and meaningful connections."
                iconPosition="right"
              />
            </div>
          </div>
        </section>
        
        {/* Render the Testimonials component here */}
        <Testimonials />
        
        {/* Remove the old hardcoded testimonial section 
        <section className="py-20 mt-10 bg-[#FDF8F3]">
          // ... old code ...
        </section>
        */}
        
        {/* Updated Section */}
        <section className="py-12 md:py-20 bg-gray-50 border-t border-gray-200">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Your Journey to Better Matches
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of people who are finding better matches and making meaningful connections with DateSpark.
            </p>
            <Link to="/get-started" className="block">
              <Button
                size="lg"
                className="bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

