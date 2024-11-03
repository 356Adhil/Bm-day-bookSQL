"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import ReceiptsForm from "../components/ReceiptsForm";

export default function Receipts() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleAddReceipt = async (receiptData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/reports/receipts", receiptData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Optionally, show a success message or clear the error
      setError(null);
      router.push("/reciepts-entries");
    } catch (error) {
      console.error("Error adding receipt:", error);
      setError("Failed to add receipt. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="p-6 mb-10">
        <ReceiptsForm onSubmit={handleAddReceipt} />
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </>
  );
}
