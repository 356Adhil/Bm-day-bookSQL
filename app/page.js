"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, BookText, ChevronRight, LayoutDashboard } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  // Mobile Layout
  const MobileView = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Glass-style header */}
      <div className="bg-white/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-50">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center">
            <div className="bg-blue-600 p-2 rounded-xl">
              <BookText className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
              BM Day Book
            </span>
          </div>
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="pt-24 px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Let&apos;s manage your business efficiently
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-blue-600 rounded-3xl blur-xl opacity-20"></div>
          <div className="relative bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="flex items-center justify-between w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all group"
              >
                <div className="flex items-center">
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  <span>Open Dashboard</span>
                </div>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-between w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all group"
              >
                <span>Login to Continue</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>

        <div className="fixed bottom-6 left-0 right-0 text-center">
          <p className="text-sm text-gray-500">
            Streamline your business operations
          </p>
        </div>
      </div>
    </div>
  );

  // Desktop Layout
  const DesktopView = () => (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar with glass effect */}
      <div className="w-96 bg-white/90 backdrop-blur-lg border-r border-gray-100 px-8 py-12 flex flex-col fixed h-full">
        <div className="flex items-center mb-12">
          <div className="bg-blue-600 p-3 rounded-xl">
            <BookText className="h-7 w-7 text-white" />
          </div>
          <span className="ml-4 text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
            BM Day Book
          </span>
        </div>

        <div className="flex-grow">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your business efficiently
          </p>
        </div>

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 w-full p-4 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="ml-96 flex-grow p-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="h-full flex items-center justify-center">
          <div className="max-w-md w-full">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-3xl blur-xl opacity-20"></div>
              <div className="relative bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                  Ready to manage your business?
                </h2>
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-between w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all group"
                  >
                    <div className="flex items-center">
                      <LayoutDashboard className="h-5 w-5 mr-3" />
                      <span>Open Dashboard</span>
                    </div>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-between w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all group"
                  >
                    <span>Login to Continue</span>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden">
        <MobileView />
      </div>
      <div className="hidden md:block">
        <DesktopView />
      </div>
    </>
  );
}
