import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const RECENT_SEARCHES_KEY = "recent_movie_searches";

function FloatingSearchBar({ isSearchBarOpen, setIsSearchBarOpen, inputRef, handleSearch, searchQuery, setSearchQuery, showDropdown, setShowDropdown, handleDropdownSelect, suggestions, setSuggestions }) {
    const searchRef = useRef<HTMLFormElement | null>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsSearchBarOpen(false)
            }
        }
        if (isSearchBarOpen) {
            window.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSearchBarOpen])

    return (
        <>
            {isSearchBarOpen &&
                <>
                    <div className="fixed md:hidden inset-0 z-[1000] backdrop-blur-[6px]">
                    </div>
                    <form ref={searchRef} onSubmit={handleSearch} className="fixed top-16 left-6 right-6 sm:left-16 sm:right-16 z-[1500] md:hidden">
                        <Input
                            ref={inputRef}
                            type="text"
                            placeholder="Search movies..."
                            className="bg-muted/50 lg:hidden h-10 border-muted-foreground/20 focus:border-movie-primary"
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
                    </form>
                </>
            }
        </>
    )
}

export default FloatingSearchBar