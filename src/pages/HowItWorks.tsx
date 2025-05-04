import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Camera, Heart, Sparkles, Zap, MessageSquare, PenLine } from "lucide-react";

// Re-use the ProcessCard component definition (or import if refactored)
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
          <Icon className="h-8 w-8 text-primary" />
        </div>
      </div>
      <div className={`flex-1 ${iconPosition === 'right' ? 'text-right' : 'text-left'}`}>
        <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16"> {/* Added padding top/bottom */}
        <div className="container max-w-4xl"> {/* Centered content */}
          
          {/* Page Title */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">How DateSpark Works</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leverage the power of AI to enhance your dating profile and connect better.
            </p>
          </div>

          {/* Process Steps - Replicated from Index.tsx */}
          <div className="grid gap-8 mb-16">
            <ProcessCard
              icon={PenLine}
              title="1. Build Your Bio"
              description="Answer a few simple questions, and our AI crafts a witty, unique dating profile bio that captures your personality in seconds."
              iconPosition="left"
            />
            <ProcessCard
              icon={Zap}
              title="2. Punch Up Your Prompts"
              description="Stuck on prompts? Generate quirky, funny, or thoughtful one-liners for your dating app prompts that will make you stand out."
              iconPosition="right"
            />
            <ProcessCard
              icon={MessageSquare}
              title="3. Get Conversation Starters"
              description="Break the ice effortlessly. Receive tailored conversation starters based on potential matches' interests and profile content."
              iconPosition="left"
            />
            <ProcessCard
              icon={Heart}
              title="4. Find Better Matches"
              description="With an optimized profile and engaging conversation starters, you'll attract more quality matches and meaningful connections."
              iconPosition="right"
            />
          </div>

          {/* Expanded Content Section */}
          <div className="space-y-12">
            {/* Understanding the AI */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Understanding the AI</h2>
              <p className="text-muted-foreground mb-4">
                DateSpark utilizes advanced large language models (LLMs) trained on vast amounts of text data. These models excel at understanding context, generating creative text, and identifying patterns. When you use features like Bio Generation or Prompt Punch-Up, the AI analyzes your inputs and generates suggestions based on common patterns associated with successful dating profiles and engaging communication.
              </p>
              <p className="text-muted-foreground">
                It's important to remember that the AI provides suggestions based on patterns and probabilities. It doesn't truly 'understand' you like a human does. Always review the suggestions, tweak them to fit your unique voice, and ensure they represent you authentically.
              </p>
            </section>

            {/* Data Privacy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Your Privacy Matters</h2>
              <p className="text-muted-foreground mb-4">
                We take your privacy seriously. When you use DateSpark features, the text you input (like answers for bio generation or prompts) is sent to the AI model for processing. We do not store the specific inputs you provide for AI generation features long-term, nor do we use them to train the AI models further.
              </p>
              <p className="text-muted-foreground">
                Your account information and payment details are handled securely according to our Privacy Policy. We strive to be transparent about how your data is used. For more details, please refer to our full <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
            </section>

            {/* AI Disclaimer Moved Here */}
            <section className="bg-muted/50 p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-3">AI-Powered Suggestions Disclaimer</h3>
              <p className="text-sm text-muted-foreground">
                DateSpark uses AI to generate suggestions for your dating profile and messages. These are intended as inspiration and recommendations only. 
                Results are not guaranteed, and success in dating depends on many factors beyond your profile, including communication, compatibility, and mutual interest. 
                Always use your own judgment when interacting with others and ensure your profile reflects your authentic self. DateSpark is a tool to assist you, not a substitute for genuine connection.
              </p>
            </section>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;

