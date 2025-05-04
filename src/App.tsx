import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom"; // Ensure BrowserRouter is NOT imported here
import Index from "./pages/Index";
import ProfileAnalysis from "./pages/ProfileAnalysis";
import ConversationStarters from "./pages/ConversationStarters";
import NotFound from "./pages/NotFound";
import BuildProfile from "./pages/BuildProfile";
import PromptPunchUp from "./pages/PromptPunchUp";
import BillingPage from "./pages/BillingPage";
import FeedbackWidget from "@/components/FeedbackWidget";
import SignIn from "./pages/SignIn"; 
import SignUp from "./pages/SignUp"; 
// Import the new pages
import AboutUs from "./pages/AboutUsPage"; // Corrected import path
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import HowItWorks from "./pages/HowItWorks";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        {/* Restore ProfileAnalysis route */}
        <Route path="/profile-analysis" element={<ProfileAnalysis />} /> 
        <Route path="/conversation-starters" element={<ConversationStarters />} />
        <Route path="/build-profile" element={<BuildProfile />} />
        <Route path="/prompt-punch-up" element={<PromptPunchUp />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/signin" element={<SignIn />} /> 
        <Route path="/signup" element={<SignUp />} /> 
        {/* Add routes for the new pages */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/how-it-works" element={<HowItWorks />} /> {/* Learn More page */}
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FeedbackWidget />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

