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
// Correct the import casing to match component names (assuming filenames are SignIn.tsx and SignUp.tsx)
import SignIn from "./pages/SignIn"; 
import SignUp from "./pages/SignUp"; 

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profile-analysis" element={<ProfileAnalysis />} />
        <Route path="/conversation-starters" element={<ConversationStarters />} />
        <Route path="/build-profile" element={<BuildProfile />} />
        <Route path="/prompt-punch-up" element={<PromptPunchUp />} />
        <Route path="/billing" element={<BillingPage />} />
        {/* Ensure routes use the correctly imported components */}
        <Route path="/signin" element={<SignIn />} /> 
        <Route path="/signup" element={<SignUp />} /> 
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FeedbackWidget />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

