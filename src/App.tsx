import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Races from "./pages/Races";
import Learn from "./pages/Learn";
import Timeline from "./pages/Timeline";
import TVDashboard from "./pages/TVDashboard";
import Shop from "./pages/Shop";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTeams from "./pages/AdminTeams";
import AdminRaces from "./pages/AdminRaces";
import AdminLearn from "./pages/AdminLearn";
import AdminProducts from "./pages/AdminProducts";
import AdminTasks from "./pages/AdminTasks";
import RaceTrack from "./pages/RaceTrack";
import RaceConfig from "./pages/RaceConfig";
import LearningPath from "./pages/LearningPath";
import Journey from "./pages/Journey";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/races" element={<Races />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/tv" element={<TVDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/teams" element={<AdminTeams />} />
          <Route path="/admin/tasks" element={<AdminTasks />} />
          <Route path="/admin/races" element={<AdminRaces />} />
          <Route path="/admin/learn" element={<AdminLearn />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/learning-path" element={<LearningPath />} />
          <Route path="/race-track/:raceId" element={<RaceTrack />} />
          <Route path="/race-config/:raceId" element={<RaceConfig />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
