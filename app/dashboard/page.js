// app/dashboard/page.js
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  BanknoteIcon,
  ClipboardListIcon,
  ReceiptIcon,
  PlusCircleIcon,
  UserIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  SparklesIcon,
  ChartPie,
  ScanSearch,
} from "lucide-react";
import Header from "../components/Header";
import AdminDashboard from "../components/AdminDashboard";
import CloseDayModal from "../components/CloseDayModal";
import { useQuery } from "@tanstack/react-query";

// API functions
const fetchUserData = async (token) => {
  if (!token) throw new Error("Token not found");
  const response = await axios.get("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data?.user;
};

const fetchSalesData = async (token) => {
  const response = await axios.get("/api/reports/sales/list", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchExpensesData = async (token) => {
  const response = await axios.get("/api/reports/expenses/list", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Quick Action Button Component
const QuickActionButton = ({ label, icon: Icon, path, onClick }) => (
  <button
    onClick={onClick}
    className="group relative flex flex-col items-center justify-center p-4 bg-white 
               rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300
               hover:-translate-y-1 overflow-hidden"
  >
    <div
      className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    />
    <div
      className="relative z-10 flex items-center justify-center w-12 h-12 mb-2
                    rounded-xl bg-blue-50 group-hover:bg-white/20 transition-all duration-300"
    >
      <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
    </div>
    <span
      className="relative z-10 text-sm font-medium text-gray-700 
                     group-hover:text-white transition-colors duration-300"
    >
      {label}
    </span>
  </button>
);

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="h-12 bg-gray-200 rounded-lg w-3/4" />
    <div className="grid grid-cols-2 gap-4">
      <div className="h-32 bg-gray-200 rounded-2xl" />
      <div className="h-32 bg-gray-200 rounded-2xl" />
    </div>
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
        ))}
      </div>
    </div>
  </div>
);

// Error Display Component
const ErrorDisplay = ({ error, retryFn }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
    <p className="text-red-600 font-medium">{error}</p>
    <button
      onClick={retryFn}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Retry
    </button>
  </div>
);

// User Dashboard Component
const UserDashboard = ({ sales, expenses, isLoading, error }) => {
  const router = useRouter();

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const totalSales = sales.reduce((sum, sale) => sum + Number(sale.amount), 0);
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const quickActions = [
    { label: "New Sale", icon: PlusCircleIcon, path: "/sale" },
    { label: "View Sales", icon: BanknoteIcon, path: "/sale-entries" },
    { label: "New Expense", icon: ReceiptIcon, path: "/expenses" },
    {
      label: "View Expenses",
      icon: ClipboardListIcon,
      path: "/expenses-entries",
    },
    { label: "Receipts", icon: ChartPie, path: "/reciepts" },
    { label: "View Receipts", icon: ScanSearch, path: "/reciepts-entries" },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h1
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 
                          bg-clip-text text-transparent"
            >
              Boba Metals
            </h1>
            <SparklesIcon className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-sm text-gray-500">
            Let&apos;s manage your business
          </p>
        </div>
        <div className="relative group">
          <div
            className="absolute inset-0 bg-blue-200 rounded-full blur-md 
                       group-hover:blur-lg transition-all duration-300 opacity-50"
          />
          <div
            className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                       flex items-center justify-center shadow-lg"
          >
            <UserIcon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Income Card */}
        <div
          className="relative group overflow-hidden bg-white p-5 rounded-2xl shadow-sm
                      hover:shadow-xl transition-all duration-300"
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 
                       group-hover:opacity-100 transition-all duration-300"
          />
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUpIcon className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Income</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              ₹{totalSales.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Expense Card */}
        <div
          className="relative group overflow-hidden bg-white p-5 rounded-2xl shadow-sm
                      hover:shadow-xl transition-all duration-300"
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-red-50 to-blue-50 opacity-0 
                       group-hover:opacity-100 transition-all duration-300"
          />
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <TrendingDownIcon className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-sm text-gray-600">Expense</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              ₹{totalExpenses.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <QuickActionButton
              key={action.path}
              {...action}
              onClick={() => router.push(action.path)}
            />
          ))}
          <CloseDayModal />
        </div>
      </div>
    </div>
  );
};

// Dashboard Content Component
function DashboardContent() {
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user", token],
    queryFn: () => fetchUserData(token),
    enabled: !!token,
  });

  const { data: sales = [], isLoading: salesLoading } = useQuery({
    queryKey: ["sales", token],
    queryFn: () => fetchSalesData(token),
    enabled: !!token && !!user,
  });

  const { data: expenses = [], isLoading: expensesLoading } = useQuery({
    queryKey: ["expenses", token],
    queryFn: () => fetchExpensesData(token),
    enabled: !!token && !!user,
  });

  if (!token) {
    return null;
  }

  if (userError) {
    return (
      <ErrorDisplay
        error="Failed to load user data. Please try again."
        retryFn={() => window.location.reload()}
      />
    );
  }

  const isLoading = userLoading || salesLoading || expensesLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <main className="max-w-lg mx-auto px-4 py-8 pb-24">
        {user?.role === "admin" ? (
          <AdminDashboard />
        ) : (
          <UserDashboard
            sales={sales}
            expenses={expenses}
            isLoading={isLoading}
            error={userError}
          />
        )}
      </main>
      <Header />
    </div>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
