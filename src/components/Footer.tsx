
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-background py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">DateWhisperer</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link to="/" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/profile-analysis" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Profile Analysis
            </Link>
            <Link to="/conversation-starters" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Conversation Starters
            </Link>
            <a href="#" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-foreground/60">
          © {new Date().getFullYear()} DateWhisperer. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
