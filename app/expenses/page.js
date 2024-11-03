// bm-day-book/app/pages/expense-entries.js
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import ExpensesForm from "../components/ExpensesForm";

export default function ExpenseEntries() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleAddExpense = async (expenseData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/reports/expenses", expenseData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Optionally, show a success message or clear the error
      setError(null);
      router.push("/expenses-entries");
    } catch (error) {
      console.error("Error adding expense:", error);
      setError("Failed to add expense. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="p-6 mb-10">
        <ExpensesForm onSubmit={handleAddExpense} />
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </>
  );
}
