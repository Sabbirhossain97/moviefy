
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Search, Video, Brain } from "lucide-react";
import { Genre, api } from "@/services/api";

interface HeaderProps {
  genres?: Genre[];
}

const Header = ({ genres: propGenres = [] }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState<Genre[]>(propGenres);
  const navigate = useNavigate();

  // Fetch genres if not provided as props
  useEffect(() => {
    if (propGenres.length === 0) {
      const fetchGenres = async () => {
        try {
          const response = await api.getGenres();
          setGenres(response.genres);
        } catch (error) {
          console.error("Error fetching genres:", error);
        }
      };
      fetchGenres();
    } else {
      setGenres(propGenres);
    }
  }, [propGenres]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Video className="h-7 w-7 text-movie-primary transition-transform group-hover:scale-110" />
              <Brain className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1 bg-background rounded-full p-0.5" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-movie-primary to-yellow-500 bg-clip-text text-transparent">
              Moviefy
            </span>
          </Link>
          
          {/* Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="space-x-1">
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 w-[450px]">
                    {genres.slice(0, 12).map((genre) => (
                      <Link
                        key={genre.id}
                        to={`/genre/${genre.id}`}
                        className="block select-none rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <div className="text-sm font-medium">{genre.name}</div>
                      </Link>
                    ))}
                    {genres.length > 12 && (
                      <Link
                        to="/genres"
                        className="block select-none rounded-md p-3 text-movie-primary font-medium hover:bg-accent transition-colors"
                      >
                        View all →
                      </Link>
                    )}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/movies/popular">
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    Popular
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/movies/top-rated">
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    Top Rated
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/recommendations">
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    <Brain className="h-4 w-4 mr-1.5" />
                    AI Search
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* Search */}
        <form onSubmit={handleSearch} className="relative w-full max-w-sm">
          <Input
            type="search"
            placeholder="Search movies..."
            className="pr-10 bg-muted/50 border-muted-foreground/20 focus:border-movie-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
