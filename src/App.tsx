
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
import WatchedList from "./pages/WatchedList";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import TVSeriesCategory from "./pages/TVSeriesCategory";
import TVSeriesDetails from "./pages/TVSeriesDetails";
import TVSeriesGenresList from "./pages/TVSeriesGenresList";
import TVSeriesGenrePage from "./pages/TVSeriesGenrePage";
import ResetPassword from "./pages/ResetPassword";

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
            <Route path="/tv/:id" element={<TVSeriesDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/movie/genre/:id" element={<GenrePage />} />
            <Route path="/tv/genre/:id" element={<TVSeriesGenrePage />} />
            <Route path="/movie/genres" element={<GenresList />} />
            <Route path="/tv/genres" element={<TVSeriesGenresList />} />
            <Route path="/movies/:category" element={<MovieCategory />} />
            <Route path="/tv-series/:category" element={<TVSeriesCategory />} />
            <Route path="/recommendations" element={<AIRecommendations />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/watched" element={<WatchedList />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
