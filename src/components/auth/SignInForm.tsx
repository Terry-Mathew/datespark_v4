import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Added CardDescription
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth hook
import { toast } from "sonner"; // Import toast for potential inline errors if needed

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loading } = useAuth(); // Get signIn function and loading state from context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    try {
      await signIn(email, password);
      // Navigation is handled within the signIn function in AuthContext upon success
    } catch (error) {
      // Error handling is done within the signIn function in AuthContext, displaying a toast
      // No need to duplicate error handling here unless specific UI feedback is required
      console.error("Sign in form submission error:", error); // Log for debugging
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription> { /* Added description */ }
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading} // Disable input while loading
              placeholder="you@example.com" // Added placeholder
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading} // Disable input while loading
              placeholder="••••••••" // Added placeholder
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}> { /* Disable button while loading */ }
            {loading ? "Signing In..." : "Sign In"} { /* Show loading text */ }
          </Button>
        </form>
        { /* Optional: Add links for Sign Up or Forgot Password here */ }
        {/* Example:
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="underline">
            Sign up
          </Link>
        </div>
        */}
      </CardContent>
    </Card>
  );
};

export default SignInForm;
