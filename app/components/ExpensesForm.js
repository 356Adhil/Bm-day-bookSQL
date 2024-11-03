"use client";

import { useState } from "react";

export default function ExpensesForm({ onSubmit, loading }) {
  const [expenseAmount, setExpenseAmount] = useState("");
  const [description, setDescription] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ expenseAmount, description });
    setExpenseAmount("");
    setDescription("");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Form Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            New Expense Entry
          </h2>
          <p className="text-gray-500 mt-2">Track your business expenses</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount Input Group */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expense Amount
            </label>
            <div
              className={`relative transition-all duration-200 ${
                focusedField === "amount" ? "scale-[1.02]" : ""
              }`}
            >
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                ₹
              </div>
              <input
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                onFocus={() => setFocusedField("amount")}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-8 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl 
                          focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 
                          transition-all duration-200"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Description Input Group */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <div
              className={`relative transition-all duration-200 ${
                focusedField === "description" ? "scale-[1.02]" : ""
              }`}
            >
              <div className="absolute left-4 top-4 text-gray-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={() => setFocusedField("description")}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl 
                          focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 
                          transition-all duration-200 resize-none h-24"
                placeholder="Enter expense details..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 py-4 px-6 text-white font-medium rounded-xl 
                      transform transition-all duration-200 
                      ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 active:scale-95 hover:shadow-lg"
                      }`}
          >
            <div className="flex items-center justify-center space-x-2">
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              <span>{loading ? "Processing..." : "Record Expense"}</span>
            </div>
          </button>
        </form>

        {/* Bottom Design Element */}
        <div className="flex justify-center mt-6">
          <div className="w-32 h-1 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
