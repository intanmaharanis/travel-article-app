import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useCategoryStore } from "../stores/categoryStore";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { cn } from "../lib/utils";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { categories, fetchAllData } = useCategoryStore();
  const location = useLocation();
  const [isTransparent, setIsTransparent] = useState(true);

  const isLandingPage = location.pathname === '/';

  const handleScroll = useCallback(() => {
    if (isLandingPage) {
      if (window.scrollY > 50) { // Adjust threshold as needed
        setIsTransparent(false);
      } else {
        setIsTransparent(true);
      }
    } else {
      setIsTransparent(false);
    }
  }, [isLandingPage]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const isActive = (path: string) => location.pathname === path;

  const navbarClasses = cn(
    "fixed w-full z-50 transition-all duration-300",
    isTransparent ? "bg-transparent shadow-none" : "bg-white shadow-md"
  );

  return (
    <nav className={navbarClasses}>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className={cn("text-2xl font-bold", isTransparent ? "text-white" : "text-purple-600")}>TanVel</span>
          </Link>

          <div className="hidden md:flex md:items-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/"
                      className={cn(
                        "px-4 py-2 text-2xl font-medium transition-colors hover:bg-accent hover:text-lime-500 focus:bg-accent focus:text-lime-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                        isActive("/") ? "text-lime-500" : (isTransparent ? "text-white" : "text-lime")
                      )}
                    >
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/categories"
                      className={cn(
                        "group inline-flex h-9 w-max items-center justify-center rounded-md  px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                        isActive("/articles") ? "bg-accent/50" : (isTransparent ? "text-white" : "text-gray-700")
                      )}
                    >
                      Categories
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/articles"
                      className={cn(
                        "group inline-flex h-9 w-max items-center justify-center rounded-md  px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                        isActive("/articles") ? "bg-accent/50" : (isTransparent ? "text-white" : "text-gray-700")
                      )}
                    >
                      Articles
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <User size={24} className={cn(isTransparent ? "text-white" : "text-gray-700")} />
                <span className={cn(isTransparent ? "text-white" : "text-gray-800", "text-md")}>{user?.username}</span>
                <button
                  onClick={logout}
                  className={cn("flex items-center bg-rose-500 px-2 py-1 rounded text-white")}
                >
                  <LogOut size={20} className="mr-1" />
                  
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center">
                <Link
                  to="/login"
                  className={cn("px-6 py-2 rounded-full bg-lime-600  text-sm font-medium text-white font-bold")}
                >
                  Login
                </Link>
                
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn("md:hidden inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500", isTransparent ? "text-white hover:text-gray-200 hover:bg-white/20" : "text-gray-400 hover:text-gray-500 hover:bg-gray-100")}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-2">
          <div className="pt-2 pb-3 space-y-1">
            {/* Mobile Nav Links */}
            <Link
              to="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive("/")
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/articles"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive("/articles")
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Articles
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/articles/category/${category.name.toLowerCase()}`}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive(`/articles/category/${category.name.toLowerCase()}`)
                    ? 'bg-purple-50 border-purple-500 text-purple-700'
                    : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <Link
              to="/categories"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive("/categories")
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>

            {isAuthenticated ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <User size={24} className="text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user?.username}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="space-y-1">
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string;
  href: string;
}

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
  ({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            to={href}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem"; 