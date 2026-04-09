import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Teams from "./pages/Teams.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import IndividualAccount from "./pages/IndividualAccount.tsx";
import InvoiceDetail from "./pages/InvoiceDetail.tsx";
import TeamFeature from "./pages/TeamFeature.tsx";
import NotFound from "./pages/NotFound.tsx";
import NewTeam from "./pages/NewTeam.tsx";
import MemberView from "./pages/MemberView.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/team-feature" element={<Index />} />
          <Route path="/team-feature/teams" element={<Index />} />
          {/* <Route path="/onboarding" element={<Onboarding />} /> */}
          <Route path="/individual-account" element={<IndividualAccount />} />
          <Route path="/project/:id" element={<Index />} />
          <Route path="/invoice/:invoiceIndex" element={<InvoiceDetail />} />
          <Route path="/team-feature" element={<TeamFeature />} />
          <Route path="/team-feature/teams" element={<TeamFeature />} />
          <Route path="/team-feature/project/:id" element={<TeamFeature />} />
          <Route path="/team-feature/my-organization" element={<TeamFeature />} />
          <Route path="/new-team" element={<NewTeam />} />
          <Route path="/new-team/teams" element={<NewTeam />} />
          <Route path="/new-team/project/:id" element={<NewTeam />} />
          <Route path="/new-team/my-organization" element={<NewTeam />} />
          <Route path="/member-view" element={<MemberView />} />
          <Route path="/member-view/teams" element={<MemberView />} />
          <Route path="/member-view/project/:id" element={<MemberView />} />
          <Route path="/member-view/my-organization" element={<MemberView />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
