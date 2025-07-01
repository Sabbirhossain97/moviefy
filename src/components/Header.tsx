import { useState, useEffect, useRef } from "react";
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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Search, Video, Brain, AlignJustify, X, ChevronDown, ChevronRight } from "lucide-react";
import { Genre, api } from "@/services/api";
import { UserMenu } from "@/components/UserMenu";
import TopNavbar from "./TopNavbar";
import FloatingSearchBar from "./FloatingSearchBar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

interface HeaderProps {
  genres?: Genre[];
}

const RECENT_SEARCHES_KEY = "recent_movie_searches";

const Header = ({ genres: propGenres = [] }: HeaderProps) => {
  const [genres, setGenres] = useState<Genre[]>(propGenres);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"movie" | "tv">("movie")
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [topNavBarOpen, setTopNavBarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moviesOpen, setMoviesOpen] = useState(false);
  const [tvSeriesOpen, setTvSeriesOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (propGenres.length === 0 && genres.length === 0) {
      api.getGenres()
        .then(response => {
          if (isMounted) setGenres(response.genres);
        })
        .catch(error => {
          console.error("Error fetching genres:", error);
        });
    } else if (propGenres.length > 0) {
      setGenres(propGenres);
    }
    return () => { isMounted = false; };
  }, [propGenres]);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
    setSuggestions(recent);
  }, []);

  const saveRecentSearch = (q: string) => {
    let recent: string[] = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
    recent = recent.filter((item) => item !== q);
    recent.unshift(q);
    if (recent.length > 7) recent.pop();
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent));
    setSuggestions(recent);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}&searchType=${searchType}`);
      setShowDropdown(false);
      setIsSearchBarOpen(false);
    }
  };

  const handleDropdownSelect = (q: string) => {
    setSearchQuery(q);
    saveRecentSearch(q);
    setShowDropdown(false);
    inputRef.current?.blur();
    navigate(`/search?query=${encodeURIComponent(q)}&searchType=${searchType}`);
  };

  const movieCategories = [
    {
      label: "Trending Now",
      path: "/movies/trending-now"
    },
    {
      label: "Popular",
      path: "/movies/popular"
    },
    {
      label: "Top Rated",
      path: "/movies/top-rated"
    },
    {
      label: "Upcoming",
      path: "/movies/upcoming"
    }
  ];

  const tvSeriesCategories = [
    {
      label: "Airing Today",
      path: "/tv-series/airing-today"
    },
    {
      label: "On The Air",
      path: "/tv-series/on-the-air"
    },
    {
      label: "Popular",
      path: "/tv-series/popular"
    },
    {
      label: "Top Rated",
      path: "/tv-series/top-rated"
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSearchBarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize)
  }, []);

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
    setMoviesOpen(false);
    setTvSeriesOpen(false);
  };

  return (
    <>
      <FloatingSearchBar
        isSearchBarOpen={isSearchBarOpen}
        setIsSearchBarOpen={setIsSearchBarOpen}
        inputRef={inputRef}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        handleDropdownSelect={handleDropdownSelect}
        suggestions={suggestions}
        setSuggestions={setSuggestions}
      />
      <TopNavbar
        topNavBarOpen={topNavBarOpen}
        setTopNavBarOpen={setTopNavBarOpen}
      />
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex px-4 h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu for screens smaller than 1180px */}
            <div className="[@media(max-width:1180px)]:block hidden">
              <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} direction="top">
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" className="p-0">
                    <AlignJustify className="h-6 w-6 hover:text-red-500 transition duration-300" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[85vh] top-0 bottom-auto rounded-t-none rounded-b-[10px]">
                  <DrawerHeader className="text-left border-b">
                    <div className="flex items-center justify-between">
                      <DrawerTitle className="flex items-center space-x-2">
                        <Video className="h-6 w-6 text-movie-primary" />
                        <span className="font-bold text-lg bg-gradient-to-r from-movie-primary to-yellow-500 bg-clip-text text-transparent">
                          Moviefy <sup className="bg-gradient-to-r from-movie-primary to-yellow-500 bg-clip-text text-transparent">AI</sup>
                        </span>
                      </DrawerTitle>
                      <DrawerClose asChild>
                        <Button variant="ghost" size="icon">
                          <X className="h-5 w-5" />
                        </Button>
                      </DrawerClose>
                    </div>
                  </DrawerHeader>
                  <div className="flex-1 overflow-y-auto p-4">
                    <nav className="space-y-2">
                      {/* Movies Section */}
                      <Collapsible open={moviesOpen} onOpenChange={setMoviesOpen}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between text-left h-12 px-3 hover:bg-accent/50 transition-all duration-200">
                            <span className="font-medium">Movies</span>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${moviesOpen ? 'rotate-180' : ''}`} />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                          <div className="space-y-1 ml-4 pt-2">
                            {movieCategories.map((category, index) => (
                              <Link
                                key={index}
                                to={category.path}
                                onClick={handleMobileLinkClick}
                                className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-md transform hover:translate-x-1"
                              >
                                {category.label}
                              </Link>
                            ))}
                            <Link
                              to="/movie/genres"
                              onClick={handleMobileLinkClick}
                              className="block px-3 py-2 text-sm text-movie-primary font-medium hover:bg-accent transition-all duration-200 rounded-md transform hover:translate-x-1"
                            >
                              Browse by genres →
                            </Link>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>

                      {/* TV Series Section */}
                      <Collapsible open={tvSeriesOpen} onOpenChange={setTvSeriesOpen}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between text-left h-12 px-3 hover:bg-accent/50 transition-all duration-200">
                            <span className="font-medium">TV Series</span>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${tvSeriesOpen ? 'rotate-180' : ''}`} />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                          <div className="space-y-1 ml-4 pt-2">
                            {tvSeriesCategories.map((category, index) => (
                              <Link
                                key={index}
                                to={category.path}
                                onClick={handleMobileLinkClick}
                                className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-md transform hover:translate-x-1"
                              >
                                {category.label}
                              </Link>
                            ))}
                            <Link
                              to="/tv/genres"
                              onClick={handleMobileLinkClick}
                              className="block px-3 py-2 text-sm text-movie-primary font-medium hover:bg-accent transition-all duration-200 rounded-md transform hover:translate-x-1"
                            >
                              Browse by genres →
                            </Link>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>

                      {/* Direct Links */}
                      <Link
                        to="/recommendations"
                        onClick={handleMobileLinkClick}
                        className="flex items-center px-3 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-md transform hover:translate-x-1"
                      >
                        <Brain className="h-4 w-4 mr-3" />
                        AI Search
                      </Link>
                      
                      <Link
                        to="/ott-updates"
                        onClick={handleMobileLinkClick}
                        className="block px-3 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-md transform hover:translate-x-1"
                      >
                        OTT Updates
                      </Link>
                    </nav>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>

            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Video className="h-7 w-7 text-movie-primary transition-transform group-hover:scale-110" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-movie-primary to-yellow-500 bg-clip-text text-transparent">
                Moviefy <sup className="bg-gradient-to-r from-movie-primary to-yellow-500 bg-clip-text text-transparent">AI</sup>
              </span>
            </Link>

            {/* Desktop Navigation Menu */}
            <NavigationMenu className="[@media(max-width:1180px)]:hidden flex">
              <NavigationMenuList className="space-x-1">
                <NavigationMenuItem >
                  <NavigationMenuTrigger className="bg-transparent hover:text-red-500">
                    Movies
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-1 gap-2 p-4 w-[220px]">
                      {movieCategories.map((movie, index) => (
                        <Link
                          key={index}
                          to={movie.path}
                          className="block select-none rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <div className="text-sm font-medium">{movie.label}</div>
                        </Link>
                      ))}
                      <Link
                        to="/movie/genres"
                        className="block select-none rounded-md p-3 text-movie-primary font-medium hover:bg-accent transition-colors"
                      >
                        Browse by genres →
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem >
                  <NavigationMenuTrigger className="bg-transparent hover:text-red-500">
                    TV Series
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-1 gap-2 p-4 w-[220px]">
                      {tvSeriesCategories.map((tv_series, index) => (
                        <Link
                          key={index}
                          to={tv_series.path}
                          className="block select-none rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <div className="text-sm font-medium">{tv_series.label}</div>
                        </Link>
                      ))}
                      <Link
                        to="/tv/genres"
                        className="block select-none rounded-md p-3 text-movie-primary font-medium hover:bg-accent transition-colors"
                      >
                        Browse by genres →
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem >
                  <Link to="/recommendations">
                    <NavigationMenuLink className="group hover:text-red-500 inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      <Brain className="h-4 w-4 mr-1.5" />
                      AI Search
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/ott-updates">
                    <NavigationMenuLink className="group hover:text-red-500 inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      OTT Updates
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-4">
            {/* search bar trigger for small screen */}
            <div className="sm:hidden">
              <Button
                type="submit"
                size="icon"
                variant="outline"
                onClick={() => setIsSearchBarOpen(true)}
                className="h-10 rounded-full px-3"
              >
                <Search className="h-4 w-4 text-muted-foreground text-white" />
              </Button>
            </div>
            <form onSubmit={handleSearch} className="hidden sm:block w-full ">
              <div className="flex ">
                <div className="relative">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search..."
                    className="pr-16 bg-muted/50 h-10 border-muted-foreground/20 focus:border-movie-primary"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 130)}
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        inputRef.current?.focus();
                      }}
                      className="absolute right-10 top-1/2 transform -translate-y-1/2 text-red-400 transition"
                    >
                      &#10005;
                    </button>
                  )}
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  >
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  {showDropdown && suggestions.length > 0 && (
                    <div className="absolute left-0 top-12 z-40 bg-background border border-muted rounded-md w-full shadow-lg max-h-52 overflow-y-auto">
                      <div className="px-3 py-2 text-xs text-muted-foreground font-medium">
                        Recent Searches
                      </div>
                      <ul>
                        {suggestions.map((q) => (
                          <li
                            key={q}
                            className="px-3 py-2 hover:bg-accent transition text-sm cursor-pointer"
                            onMouseDown={() => handleDropdownSelect(q)}
                          >
                            {q}
                          </li>
                        ))}
                      </ul>
                      {suggestions.length > 0 && (
                        <div className="px-3 py-2">
                          <button
                            type="button"
                            className="text-xs text-muted-foreground hover:underline"
                            onMouseDown={e => {
                              e.preventDefault();
                              localStorage.removeItem(RECENT_SEARCHES_KEY);
                              setSuggestions([]);
                            }}
                          >
                            Clear all
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <Select
                    value={searchType}
                    onValueChange={(v) => setSearchType(v as 'movie' | 'tv')}
                  >
                    <SelectTrigger className="rounded-r-md">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="movie">Movies</SelectItem>
                      <SelectItem value="tv">Series</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
            <UserMenu />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
