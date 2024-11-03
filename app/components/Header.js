"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  HomeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  LogInIcon,
} from "lucide-react";

export default function BottomNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("/");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setActiveTab(window.location.pathname);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const handleNavigation = (path) => {
    setActiveTab(path);
    router.push(path);
  };

  const NavItem = ({ icon: Icon, label, onClick, path }) => {
    const isActive = path === activeTab;

    return (
      <button
        onClick={onClick}
        className={`group relative flex flex-col items-center justify-center w-24 py-2
                   transition-all duration-500 ease-in-out`}
      >
        {/* Animated Indicator Line */}
        {isActive && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-1">
            <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
          </div>
        )}

        {/* Icon Container with Premium Animation */}
        <div
          className={`relative transition-all duration-500 ease-in-out
                     ${
                       isActive
                         ? "transform -translate-y-2 scale-110"
                         : "group-hover:-translate-y-1"
                     }`}
        >
          {/* Premium Glow Effect */}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-25 blur-2xl rounded-full" />
          )}

          {/* Icon Circle with Glass Effect */}
          <div
            className={`relative flex items-center justify-center w-14 h-14 rounded-2xl
                       backdrop-blur-lg transition-all duration-500 transform
                       ${
                         isActive
                           ? "bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200/50"
                           : "bg-gray-50/90 text-gray-600 group-hover:bg-gray-100/95"
                       }`}
          >
            <Icon
              className={`w-6 h-6 transition-all duration-500
                         ${
                           isActive
                             ? "stroke-2"
                             : "stroke-[1.5] group-hover:stroke-2"
                         }`}
            />

            {/* Subtle Pulse Animation for Active State */}
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400 to-purple-400 rounded-2xl animate-pulse opacity-20" />
            )}
          </div>
        </div>

        {/* Label with Premium Typography */}
        <span
          className={`text-xs mt-2 font-medium tracking-wide transition-colors duration-500
                     ${
                       isActive
                         ? "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                         : "text-gray-600 group-hover:text-gray-800"
                     }`}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <>
      {/* Spacer */}
      <div className="h-28" />

      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        {/* Premium Glass Background */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-2xl" />

        {/* Main Navigation Container */}
        <div className="relative max-w-lg mx-auto px-6 h-24">
          {/* Navigation Items Container */}
          <div className="flex items-center justify-around h-full">
            <NavItem
              icon={HomeIcon}
              label="Home"
              onClick={() => handleNavigation("/")}
              path="/"
            />

            <NavItem
              icon={LayoutDashboardIcon}
              label="Dashboard"
              onClick={() => handleNavigation("/dashboard")}
              path="/dashboard"
            />

            {isLoggedIn ? (
              <NavItem
                icon={LogOutIcon}
                label="Logout"
                onClick={handleLogout}
                path="/logout"
              />
            ) : (
              <NavItem
                icon={LogInIcon}
                label="Login"
                onClick={() => handleNavigation("/login")}
                path="/login"
              />
            )}
          </div>
        </div>

        {/* Safe Area Padding for iOS with Premium Glass Effect */}
        <div className="h-safe-area-inset-bottom bg-white/80 backdrop-blur-lg" />
      </nav>
    </>
  );
}
