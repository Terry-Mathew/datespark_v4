import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-background py-8 mt-16"> {/* Added mt-16 for spacing */}
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">DateSpark</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link to="/" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/pricing" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="/terms" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
        
        {/* AI Disclaimer Added */}
        <div className="mt-6 pt-6 border-t border-border/50 text-center text-xs text-foreground/50">
          <p className="mb-1">AI-Powered Suggestions Disclaimer:</p>
          <p>
            DateSpark uses AI to generate suggestions for your dating profile and messages. These are intended as inspiration and recommendations only. 
            Results are not guaranteed, and success depends on many factors. Always use your own judgment and ensure your profile reflects your authentic self.
          </p>
        </div>
        
        <div className="mt-4 text-center text-sm text-foreground/60">
          © {new Date().getFullYear()} DateSpark. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

