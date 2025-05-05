import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, LogOut, UserCircle } from "lucide-react"; // Added LogOut, UserCircle
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { toast } from "sonner"; // Import toast for sign out feedback
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"; // Import Dropdown components

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth(); // Get user, signOut, and loading state
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Success toast is handled in AuthContext
      navigate("/"); // Navigate to home after sign out
    } catch (error) {
      // Error toast is handled in AuthContext
      console.error("Navbar sign out error:", error);
    }
  };

  const renderAuthButtons = () => {
    if (loading) {
      return <Button variant="ghost" disabled>Loading...</Button>;
    }
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <UserCircle className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* Add links to settings or profile page if needed */}
            {/* <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem> */}
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 focus:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          {/* Updated Sign In Button: Added hover:text-primary */}
          <Button 
            variant="ghost" 
            onClick={() => navigate("/signin")} 
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            Sign In
          </Button>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
        </div>
      );
    }
  };

  const renderMobileAuthButtons = () => {
    if (loading) {
      return <Button variant="ghost" disabled className="w-full justify-start px-4 py-2">Loading...</Button>;
    }
    if (user) {
      return (
        <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start px-4 py-2 text-red-600 hover:text-red-700">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      );
    } else {
      return (
        <>
          <Button variant="ghost" onClick={() => { navigate("/signin"); setIsMenuOpen(false); }} className="w-full justify-start px-4 py-2">
            Sign In
          </Button>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2" onClick={() => { navigate("/signup"); setIsMenuOpen(false); }}>
            Sign Up
          </Button>
        </>
      );
    }
  };

  return (
    <header className="fixed w-full bg-background/90 backdrop-blur-sm z-50 border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">DateSpark</span>
        </Link>
        
        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Render mobile auth state indicator if needed before menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        
        {/* Desktop navigation - Increased gap to gap-8 for more spacing */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/pricing" className="text-foreground/80 hover:text-foreground transition-colors">
            Pricing
          </Link>
          {/* Render dynamic auth buttons */}
          {renderAuthButtons()}
        </nav>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 flex flex-col gap-2">
            <Link 
              to="/" 
              className="px-4 py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/pricing" 
              className="px-4 py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="px-4 pt-2 border-t mt-2">
              {/* Render dynamic mobile auth buttons */}
              {renderMobileAuthButtons()}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

