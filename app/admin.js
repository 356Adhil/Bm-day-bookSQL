// bm-day-book/app/pages/admin.js
import { useEffect, useState } from "react";
import Header from "./components/Header";
import { useRouter } from "next/router";

export default function Admin() {
  const [reports, setReports] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch the reports data (replace with date range as needed)
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/reports");
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div>
      <Header />
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="p-4 bg-white shadow rounded">
              <h2 className="text-lg font-semibold">
                Date: {new Date(report.date).toLocaleDateString()}
              </h2>
              <p>Total Sales: {report.totalSales}</p>
              <p>Total Expenses: {report.totalExpenses}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
