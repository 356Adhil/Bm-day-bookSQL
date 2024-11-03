"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SalesForm from "../components/SalesForm";
import Header from "../components/Header";
import axios from "axios";

export default function Sales() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    console.log("Sales data submitted:", formData);

    const dataToSend = {
      amount: formData.saleAmount,
      date: new Date().toISOString(),
      invoiceNumber: formData.invoiceNumber,
    };

    try {
      setLoading(true);
      const response = await axios.post("/api/reports/sales", dataToSend);
      console.log("Response from API:", response.data);

      router.push("/sale-entries");
    } catch (error) {
      console.error("Error submitting sales data:", error);
      alert("Failed to submit sales data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="p-6">
        <SalesForm onSubmit={handleFormSubmit} loading={loading} />
      </div>
    </>
  );
}
