"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { Plus, X, PenLine, ArrowLeft } from "lucide-react";

export default function SaleEntries() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSale, setEditingSale] = useState(null);
  const [updatedAmount, setUpdatedAmount] = useState("");
  const [updatedInvoiceNumber, setUpdatedInvoiceNumber] = useState("");

  useEffect(() => {
    const fetchSalesEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/reports/sales/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSales(response.data);
      } catch (error) {
        console.error("Error fetching sales entries:", error);
        setError("Failed to fetch sales entries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesEntries();
  }, []);

  const handleEditClick = (sale) => {
    setEditingSale(sale);
    setUpdatedAmount(sale.amount);
    setUpdatedInvoiceNumber(sale.invoiceNumber);
  };

  const handleUpdateSale = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      console.log("editingSale:", editingSale);
      await axios.put(
        `/api/reports/sales/list`,
        {
          id: editingSale.id,
          amount: updatedAmount,
          invoiceNumber: updatedInvoiceNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSales((prevSales) =>
        prevSales.map((sale) =>
          sale.id === editingSale.id
            ? {
                ...sale,
                amount: updatedAmount,
                invoiceNumber: updatedInvoiceNumber,
              }
            : sale
        )
      );

      setEditingSale(null);
      setUpdatedAmount("");
      setUpdatedInvoiceNumber("");
    } catch (error) {
      console.error("Error updating sale entry:", error);
      setError("Failed to update sale entry. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-2xl m-4 shadow-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-lg mx-auto pb-6">
        {/* Mobile-style header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-10 px-4 py-4 mb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <a href="/dashboard">
                <button className="p-2 hover:bg-gray-100 rounded-xl">
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
              </a>
              <h1 className="text-xl font-semibold text-gray-800">Sales</h1>
            </div>
            <a href="/sale">
              <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
                <Plus className="w-5 h-5" />
              </button>
            </a>
          </div>
        </div>

        {/* Sales summary card */}
        <div className="mx-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-sm text-gray-500 mb-2">Total Sales</div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              ₹
              {sales
                .reduce((sum, sale) => sum + Number(sale.amount), 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-blue-500 font-medium">
              {sales.length} Transactions
            </div>
          </div>
        </div>

        {/* Sales list */}
        <div className="px-4">
          <div className="space-y-3">
            {sales.length > 0 ? (
              sales.map((sale) => (
                <div
                  key={sale.id}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-gray-500">
                          Invoice #{sale.invoiceNumber}
                        </div>
                        <button
                          onClick={() => handleEditClick(sale)}
                          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                        >
                          <PenLine className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      <div className="text-xl font-bold text-gray-800">
                        ₹{Number(sale.amount).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {new Date(sale.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">No sales entries yet</div>
              </div>
            )}
          </div>
        </div>

        {/* Edit modal */}
        {editingSale && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center sm:items-center p-4 z-50">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Edit Sale
                </h2>
                <button
                  onClick={() => setEditingSale(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleUpdateSale} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Amount
                  </label>
                  <input
                    type="tel"
                    value={updatedAmount}
                    onChange={(e) => setUpdatedAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={updatedInvoiceNumber}
                    onChange={(e) => setUpdatedInvoiceNumber(e.target.value)}
                    placeholder="Enter invoice number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Header />
    </div>
  );
}
