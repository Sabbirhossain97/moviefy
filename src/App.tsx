
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import MovieDetails from "./pages/MovieDetails";
import Search from "./pages/Search";
import GenrePage from "./pages/GenrePage";
import GenresList from "./pages/GenresList";
import MovieCategory from "./pages/MovieCategory";
import NotFound from "./pages/NotFound";
import AIRecommendations from "./pages/AIRecommendations";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/genre/:id" element={<GenrePage />} />
            <Route path="/genres" element={<GenresList />} />
            <Route path="/movies/:category" element={<MovieCategory />} />
            <Route path="/recommendations" element={<AIRecommendations />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
