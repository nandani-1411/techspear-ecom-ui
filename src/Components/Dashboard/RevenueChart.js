import React from "react";
import { Line } from "react-chartjs-2";
import { FaFileDownload } from "react-icons/fa";

const RevenueChart = ({ data }) => {
    console.log("MY Revenue data ", data);

    if (!data || !data.datasets || data.datasets.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-2xl border-2 border-blue-400">
                <h3 className="text-xl font-semibold">📈 Revenue Growth</h3>
                <p className="text-gray-600 mt-4">No revenue data available</p>
            </div>
        );
    }

    const revenueValues = data.datasets[0].data;
    let revenueFeedback = "";

    if (revenueValues.length >= 2) {
        const revenueChange = ((revenueValues.at(-1) - revenueValues.at(-2)) / revenueValues.at(-2)) * 100;
        revenueFeedback = isNaN(revenueChange)
            ? "No revenue trend available."
            : revenueChange > 0
            ? `📈 Revenue increased by ${revenueChange.toFixed(2)}% this month!`
            : `📉 Revenue decreased by ${Math.abs(revenueChange).toFixed(2)}%.`;
    } else if (revenueValues.length === 1) {
        revenueFeedback = `🟡 Showing revenue data for only ${data.labels[0]}. Need more months for trend.`;
    } else {
        revenueFeedback = "No revenue data available.";
    }
    
    

    const generateReport = () => {
        const csvContent = [
            ["Month", "Revenue"],
            ...(data.labels || []).map((label, i) => [label, revenueValues[i]]),
        ]
            .map(row => row.join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "revenue_report.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-2xl border-2 border-blue-400">
            <h3 className="text-xl font-semibold">📈 Revenue Growth</h3>
            <Line data={data} />
            <p className="mt-4 text-gray-700">{revenueFeedback}</p>

            <button
                onClick={generateReport}
                className="mt-4 px-4 py-2 flex items-center gap-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition duration-300"
            >
                <FaFileDownload /> Generate Revenue Report
            </button>
        </div>
    );
};

export default RevenueChart;
