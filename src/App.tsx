import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProfileAnalysis from "./pages/ProfileAnalysis";
import ConversationStarters from "./pages/ConversationStarters";
import NotFound from "./pages/NotFound";
import BuildProfile from "./pages/BuildProfile";
import PromptPunchUp from "./pages/PromptPunchUp";
import Pricing from "./pages/Pricing";
import FeedbackWidget from "@/components/FeedbackWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" closeButton theme="light" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile-analysis" element={<ProfileAnalysis />} />
          <Route path="/conversation-starters" element={<ConversationStarters />} />
          <Route path="/build-profile" element={<BuildProfile />} />
          <Route path="/prompt-punch-up" element={<PromptPunchUp />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FeedbackWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
