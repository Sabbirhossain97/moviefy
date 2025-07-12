
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import MovieDetails from "./pages/movies/MovieDetails";
import Search from "./pages/search/Search";
import GenrePage from "./pages/movies/GenrePage";
import GenresList from "./pages/movies/GenresList";
import MovieCategory from "./pages/movies/MovieCategory";
import NotFound from "./pages/NotFound";
import AIRecommendations from "./pages/ai/AIRecommendations";
import Wishlist from "./pages/lists/Wishlist";
import WatchedList from "./pages/lists/WatchedList";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Profile from "./pages/auth/Profile";
import TVSeriesCategory from "./pages/tv-series/TVSeriesCategory";
import TVSeriesDetails from "./pages/tv-series/TVSeriesDetails";
import TVSeriesGenresList from "./pages/tv-series/TVSeriesGenresList";
import TVSeriesGenrePage from "./pages/tv-series/TVSeriesGenrePage";
import ResetPassword from "./pages/auth/ResetPassword";

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
