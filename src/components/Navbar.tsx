import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Home, LayoutList, FileText } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { cn } from "../lib/utils";

interface NavLink {
  name: string;
  path: string;
  icon?: React.ElementType;
}

const navLinks: NavLink[] = [
  { name: "Home", path: "/", icon: Home },
  { name: "Categories", path: "/categories", icon: LayoutList },
  { name: "Articles", path: "/articles", icon: FileText },
];

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isTransparent, setIsTransparent] = useState(true);

  const isLandingPage = location.pathname === '/';

  const handleScroll = useCallback(() => {
    if (isLandingPage) {
      if (window.scrollY > 50) {
        setIsTransparent(false);
      } else {
        setIsTransparent(true);
      }
    } else {
      setIsTransparent(false);
    }
  }, [isLandingPage]);


  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const isActive = (path: string) => location.pathname === path;

  const navbarClasses = cn(
    "fixed w-full z-50 transition-all duration-300",
    isTransparent ? "bg-transparent shadow-none" : "bg-white shadow-md"
  );

  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

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
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.path}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={link.path}
                        className={cn(
                          "px-4 py-2 font-medium transition-colors hover:bg-accent hover:text-lime-500 focus:bg-accent focus:text-lime-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                          "flex items-center space-x-1 whitespace-nowrap",
                          isActive(link.path) ? "text-lime-500" : (isTransparent ? "text-white" : "text-gray-700")
                        )}
                      >
                        {link.icon && <link.icon size={20} className="inline" />}
                        <span>{link.name}</span>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
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
                  Logout
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
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn("md:hidden inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500", isTransparent ? "text-white hover:text-gray-200 hover:bg-white/20" : "text-gray-400 hover:text-gray-500 hover:bg-gray-100")}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>
        <div className="pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                "flex items-center space-x-2 whitespace-nowrap",
                isActive(link.path)
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              )}
              onClick={handleLinkClick}
            >
              {link.icon && <link.icon size={20} className="inline" />}
              <span>{link.name}</span>
            </Link>
          ))}
    

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
                    handleLinkClick();
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
                  onClick={handleLinkClick}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={handleLinkClick}
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {/* {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )} */}
    </nav>
  );
} 