import { Heart, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-background py-8 mt-16"> {/* Added mt-16 for spacing */}
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">DateSpark</span>
          </div>
          
          {/* Essential Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {/* Placeholder links - update these with actual routes */}
            <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-foreground/80 hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link to="/terms" className="text-foreground/80 hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-foreground/80 hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
          </div>

          {/* Instagram Link */}
          <div className="flex justify-center md:justify-end">
            <a 
              href="https://instagram.com" // Replace with actual Instagram profile URL
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-foreground/60 hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        {/* AI Disclaimer */}
        <div className="mt-8 pt-6 border-t border-border/50 text-center text-xs text-foreground/50">
          <p className="mb-1">AI-Powered Suggestions Disclaimer:</p>
          <p>
            DateSpark uses AI to generate suggestions for your dating profile and messages. These are intended as inspiration and recommendations only. 
            Results are not guaranteed, and success depends on many factors. Always use your own judgment and ensure your profile reflects your authentic self.
          </p>
        </div>
        
        {/* Copyright */}
        <div className="mt-6 text-center text-xs text-foreground/60">
          © {new Date().getFullYear()} DateSpark. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

