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
import SocialNetwork from "./pages/SocialNetwork";
import AnnualMissions from "./pages/AnnualMissions";
import TVDashboard from "./pages/TVDashboard";
import Shop from "./pages/Shop";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTeams from "./pages/AdminTeams";
import AdminRaces from "./pages/AdminRaces";
import AdminLearn from "./pages/AdminLearn";
import AdminProducts from "./pages/AdminProducts";
import AdminTasks from "./pages/AdminTasks";
import AdminRewards from "./pages/AdminRewards";
import AdminUsers from "./pages/AdminUsers";
import AdminAnnualMissions from "./pages/AdminAnnualMissions";
import RaceTrack from "./pages/RaceTrack";
import Exchange from "./pages/Exchange";
import RaceConfig from "./pages/RaceConfig";
import LearningPath from "./pages/LearningPath";
import Journey from "./pages/Journey";
import Profile from "./pages/Profile";
import MyTeam from "./pages/MyTeam";
import Leaderboard from "./pages/Leaderboard";
import QuizPlay from "./pages/QuizPlay";
import CourseView from "./pages/CourseView";
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
          <Route path="/social" element={<SocialNetwork />} />
          <Route path="/annual-missions" element={<AnnualMissions />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/exchange" element={<Exchange />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-team" element={<MyTeam />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/quiz/:quizId" element={<QuizPlay />} />
          <Route path="/course/:courseId" element={<CourseView />} />
          <Route path="/tv" element={<TVDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/teams" element={<AdminTeams />} />
          <Route path="/admin/tasks" element={<AdminTasks />} />
          <Route path="/admin/races" element={<AdminRaces />} />
          <Route path="/admin/learn" element={<AdminLearn />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/rewards" element={<AdminRewards />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/learning-path" element={<LearningPath />} />
          <Route path="/admin/annual-missions" element={<AdminAnnualMissions />} />
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
