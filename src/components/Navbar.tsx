
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-background/90 backdrop-blur-sm z-50 border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">DateSpark</span>
        </Link>
        
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/profile-analysis" className="text-foreground/80 hover:text-foreground transition-colors">
            Profile Analysis
          </Link>
          <Link to="/build-profile" className="text-foreground/80 hover:text-foreground transition-colors">
            Build My Profile
          </Link>
          <Link to="/prompt-punch-up" className="text-foreground/80 hover:text-foreground transition-colors">
            Prompt Punch-Up
          </Link>
          <Link to="/conversation-starters" className="text-foreground/80 hover:text-foreground transition-colors">
            Conversation Starters
          </Link>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Get Started
          </Button>
        </nav>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b p-4 md:hidden animate-fadeIn">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-foreground/80 hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/profile-analysis" 
                className="text-foreground/80 hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile Analysis
              </Link>
              <Link 
                to="/build-profile" 
                className="text-foreground/80 hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Build My Profile
              </Link>
              <Link 
                to="/prompt-punch-up" 
                className="text-foreground/80 hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Prompt Punch-Up
              </Link>
              <Link 
                to="/conversation-starters" 
                className="text-foreground/80 hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Conversation Starters
              </Link>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                Get Started
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
