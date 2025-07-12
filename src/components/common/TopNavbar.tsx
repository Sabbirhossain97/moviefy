import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Brain, X } from "lucide-react";
import { Link } from "react-router-dom";

function TopNavbar({ topNavBarOpen, setTopNavBarOpen }) {
    return (
        <aside className={`${topNavBarOpen ? "-translate-y-0" : "-translate-y-full"} flex justify-center transition duration-300 fixed z-[1000] bg-[#1F242E] left-0 top-0 right-0 bottom-0 h-72`}>
            <button
                onClick={() => setTopNavBarOpen(!topNavBarOpen)}
            >
                <X className="absolute right-4 top-4 hover:text-red-500 transition duration-300" />
            </button>
            <NavigationMenu className="py-4 flex justify-center">
                <NavigationMenuList className="flex flex-col items-center space-y-2">
                    <NavigationMenuItem>
                        <Link to="/genres">
                            <NavigationMenuLink className="group ml-1 inline-flex hover:text-red-500 h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-md font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                                All genres
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link to="/movies/popular">
                            <NavigationMenuLink className="group inline-flex hover:text-red-500 h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-md font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                                Popular
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <Link to="/movies/top-rated">
                            <NavigationMenuLink className="group inline-flex hover:text-red-500 h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-md font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                                Top Rated
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <Link to="/recommendations">
                            <NavigationMenuLink className="group inline-flex hover:text-red-500 h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-md font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                                <Brain className="h-4 w-4 mr-1.5" />
                                AI Search
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </aside>
    )
}

export default TopNavbar