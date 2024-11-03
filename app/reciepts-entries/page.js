"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { Plus, X, PenLine, ArrowLeft } from "lucide-react";

export default function ReceiptEntries() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReceipt, setEditingReceipt] = useState(null);
  const [updatedAmount, setUpdatedAmount] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  useEffect(() => {
    const fetchReceiptEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/reports/receipts/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReceipts(response.data);
      } catch (error) {
        console.error("Error fetching receipt entries:", error);
        setError("Failed to fetch receipt entries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceiptEntries();
  }, []);

  const handleEditClick = (receipt) => {
    setEditingReceipt(receipt);
    setUpdatedAmount(receipt.amount);
    setUpdatedDescription(receipt.description);
  };

  const handleUpdateReceipt = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `/api/reports/receipts/list`,
        {
          id: editingReceipt.id,
          amount: updatedAmount,
          description: updatedDescription,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReceipts((prevReceipts) =>
        prevReceipts.map((receipt) =>
          receipt.id === editingReceipt.id
            ? {
                ...receipt,
                amount: updatedAmount,
                description: updatedDescription,
              }
            : receipt
        )
      );

      setEditingReceipt(null);
      setUpdatedAmount("");
      setUpdatedDescription("");
    } catch (error) {
      console.error("Error updating receipt entry:", error);
      setError("Failed to update receipt entry. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
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
              <h1 className="text-xl font-semibold text-gray-800">Receipts</h1>
            </div>
            <a href="/reciepts">
              <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
                <Plus className="w-5 h-5" />
              </button>
            </a>
          </div>
        </div>

        {/* Receipts summary card */}
        <div className="mx-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-sm text-gray-500 mb-2">Total Receipts</div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              ₹
              {receipts
                .reduce((sum, receipt) => sum + Number(receipt.amount), 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-green-500 font-medium">
              {receipts.length} Transactions
            </div>
          </div>
        </div>

        {/* Receipts list */}
        <div className="px-4">
          <div className="space-y-3">
            {receipts.length > 0 ? (
              receipts.map((receipt) => (
                <div
                  key={receipt.id}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-gray-500">
                          {receipt.description}
                        </div>
                        <button
                          onClick={() => handleEditClick(receipt)}
                          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                        >
                          <PenLine className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      <div className="text-xl font-bold text-gray-800">
                        ₹{Number(receipt.amount).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {new Date(receipt.date).toLocaleDateString("en-US", {
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
                <div className="text-gray-400 mb-2">No receipt entries yet</div>
              </div>
            )}
          </div>
        </div>

        {/* Edit modal */}
        {editingReceipt && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center sm:items-center p-4 z-50">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Edit Receipt
                </h2>
                <button
                  onClick={() => setEditingReceipt(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleUpdateReceipt} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={updatedAmount}
                    onChange={(e) => setUpdatedAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Description
                  </label>
                  <input
                    type="text"
                    value={updatedDescription}
                    onChange={(e) => setUpdatedDescription(e.target.value)}
                    placeholder="Enter description"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
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
