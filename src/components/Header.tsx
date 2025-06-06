
import React, { useState } from "react";
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
import { Search, Video } from "lucide-react";
import { Genre } from "@/services/api";
import { cn } from "@/lib/utils";

interface HeaderProps {
  genres?: Genre[];
}

const Header = ({ genres = [] }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <Video className="h-6 w-6 text-movie-primary" />
            <span className="font-bold text-xl">MovieDB</span>
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className="px-4 py-2 hover:text-movie-primary transition-colors">
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 w-[400px]">
                    {genres.slice(0, 12).map((genre) => (
                      <Link
                        key={genre.id}
                        to={`/genre/${genre.id}`}
                        className="block select-none space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {genre.name}
                      </Link>
                    ))}
                    <Link
                      to="/genres"
                      className="block select-none space-y-1 rounded-md p-2 font-semibold text-movie-primary"
                    >
                      View all genres →
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/movies/popular">
                  <NavigationMenuLink className="px-4 py-2 hover:text-movie-primary transition-colors">
                    Popular
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/movies/top-rated">
                  <NavigationMenuLink className="px-4 py-2 hover:text-movie-primary transition-colors">
                    Top Rated
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/movies/upcoming">
                  <NavigationMenuLink className="px-4 py-2 hover:text-movie-primary transition-colors">
                    Upcoming
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full max-w-md flex items-center">
          <Input
            type="search"
            placeholder="Search movies..."
            className="pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-0"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
