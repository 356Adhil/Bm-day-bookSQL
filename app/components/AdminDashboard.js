"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Wallet,
  CreditCard,
  TrendingUp,
} from "lucide-react";

export default function AdminDashboard() {
  const [reportData, setReportData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalSales: 0,
    totalExpenses: 0,
    profitMargin: 0,
  });

  const [previousStats, setPreviousStats] = useState({
    totalSales: 0,
    totalExpenses: 0,
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  useEffect(() => {
    async function fetchReports(date) {
      try {
        const [salesResponse, expensesResponse] = await Promise.all([
          fetch(`/api/reports/sales?date=${date}`),
          fetch(`/api/reports/expenses?date=${date}`),
        ]);

        const salesData = await salesResponse.json();
        const expensesData = await expensesResponse.json();

        console.log("Sales Data:", salesData);
        console.log("Expenses Data:", expensesData);
        const combinedData = salesData.map((sale) => {
          const expense =
            expensesData.find((exp) => exp.date === sale.date) || {};
          return {
            date: sale.date,
            totalSales: sale.totalSales || 0,
            totalExpenses: expense.totalExpenses || 0,
          };
        });

        setReportData(combinedData);

        const totalSales = combinedData.reduce(
          (sum, item) => sum + item.totalSales,
          0
        );
        const totalExpenses = combinedData.reduce(
          (sum, item) => sum + item.totalExpenses,
          0
        );
        const profitMargin =
          ((totalSales - totalExpenses) / totalSales) * 100 || 0;

        setSummaryStats({
          totalSales,
          totalExpenses,
          profitMargin,
        });

        const salesChange = previousStats.totalSales
          ? ((totalSales - previousStats.totalSales) /
              previousStats.totalSales) *
            100
          : 0;
        const expensesChange = previousStats.totalExpenses
          ? ((totalExpenses - previousStats.totalExpenses) /
              previousStats.totalExpenses) *
            100
          : 0;

        const salesTrendValue = salesChange ? salesChange.toFixed(1) : "0.0";
        const expensesTrendValue = expensesChange
          ? expensesChange.toFixed(1)
          : "0.0";

        const profitMarginChange = previousStats.profitMargin
          ? ((profitMargin - previousStats.profitMargin) /
              previousStats.profitMargin) *
            100
          : 0;

        const profitMarginTrendValue = profitMarginChange
          ? `${profitMarginChange >= 0 ? "+" : ""}${profitMarginChange.toFixed(
              1
            )}%`
          : "0.0%";

        setPreviousStats({
          totalSales,
          totalExpenses,
          profitMargin,
        });

        setSummaryStats((prevStats) => ({
          ...prevStats,
          salesTrendValue: `${salesChange >= 0 ? "+" : ""}${salesTrendValue}%`,
          expensesTrendValue: `${
            expensesChange >= 0 ? "+" : ""
          }${expensesTrendValue}%`,
          profitMarginTrendValue,
        }));
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    }

    fetchReports(selectedDate);
  }, [
    selectedDate,
    previousStats.totalSales,
    previousStats.totalExpenses,
    previousStats.profitMargin,
  ]);

  // Custom Card Component
  const SummaryCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    subtitle,
  }) => {
    const isPositive = trend === "up";
    return (
      <div className="relative bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-6">
          <div className="bg-gray-50 p-3 rounded-xl">
            <Icon className="h-6 w-6 text-gray-700" />
          </div>
          {trendValue && (
            <span
              className={`flex items-center text-sm font-medium px-3 py-1 rounded-full ${
                isPositive
                  ? "text-emerald-700 bg-emerald-50"
                  : "text-rose-700 bg-rose-50"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {trendValue}
            </span>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {value}
          </h3>
          {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Financial Overview
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track your business performance
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-sm text-gray-600 bg-transparent border-none focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SummaryCard
            title="Total Revenue"
            value={`₹${summaryStats.totalSales.toLocaleString()}`}
            icon={Wallet}
            trend="up"
            trendValue={summaryStats.salesTrendValue}
            subtitle="Total revenue generated"
          />

          <SummaryCard
            title="Total Expenses"
            value={`₹${summaryStats.totalExpenses.toLocaleString()}`}
            icon={CreditCard}
            trend="down"
            trendValue={summaryStats.expensesTrendValue}
            subtitle="Total expenses incurred"
          />

          <SummaryCard
            title="Profit Margin"
            value={`${summaryStats.profitMargin.toFixed(1)}%`}
            icon={TrendingUp}
            trend={summaryStats.profitMarginTrendValue >= 0 ? "up" : "down"}
            trendValue={summaryStats.profitMarginTrendValue}
            subtitle="Net profit percentage"
          />
        </div>
      </div>
    </div>
  );
}
