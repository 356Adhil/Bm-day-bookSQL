"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SalesForm from "../components/SalesForm";
import Header from "../components/Header";
import axios from "axios"; // Make sure axios is installed

export default function Sales() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // State to manage loading

  const handleFormSubmit = async (formData) => {
    console.log("Sales data submitted:", formData);

    // Prepare the data to be sent to the backend
    const dataToSend = {
      amount: formData.saleAmount,
      date: new Date().toISOString(), // Assuming you want to set the current date
      invoiceNumber: formData.invoiceNumber,
    };

    try {
      setLoading(true); // Set loading state to true
      const response = await axios.post("/api/reports/sales", dataToSend);
      console.log("Response from API:", response.data); // Log response from the API

      // Redirect back to the dashboard after successful submission
      router.push("/sale-entries");
    } catch (error) {
      console.error("Error submitting sales data:", error);
      alert("Failed to submit sales data. Please try again."); // Show an alert on error
    } finally {
      setLoading(false); // Reset loading state
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
