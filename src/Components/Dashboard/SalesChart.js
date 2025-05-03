import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { FaFileDownload } from "react-icons/fa";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesChart = ({ data }) => {
    console.log("MY sale data ", data);

    // If no data is available, show fallback message
    if (!data || !data.datasets || data.datasets.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-2xl border-2 border-green-400">
                <h3 className="text-xl font-semibold">📊 Sales Chart</h3>
                <p className="text-gray-600 mt-4">No sales data available</p>
            </div>
        );
    }

    const salesArray = data.datasets[0].data;
    const salesValues = salesArray || [];

    // Feedback message for sales trend
    let salesFeedback = "";

    if (salesValues.length >= 2) {
        const salesChange = ((salesValues.at(-1) - salesValues.at(-2)) / salesValues.at(-2)) * 100;
        salesFeedback = salesChange > 0
            ? `📈 Sales increased by ${salesChange.toFixed(2)}% this month!`
            : `📉 Sales decreased by ${Math.abs(salesChange).toFixed(2)}%.`;
    } else if (salesValues.length === 1) {
        salesFeedback = `🟡 Showing sales data for only ${data.labels[0]}. Need more months for trend.`;
    } else {
        salesFeedback = "No sales data available.";
    }
    

    // Generate downloadable CSV report
    const generateReport = () => {
        const csvContent = [
            ["Month", "Sales"],
            ...data.labels.map((label, i) => [label, salesArray[i]])
        ]
            .map(row => row.join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sales_report.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-2xl border-2 border-green-400">
            <h3 className="text-xl font-semibold">📊 Sales Chart</h3>
            <Line data={data} />
            <p className="mt-4 text-gray-700">{salesFeedback}</p>

            <button
                onClick={generateReport}
                className="mt-4 px-4 py-2 flex items-center gap-2 bg-green-500 text-white font-medium rounded-lg shadow hover:bg-green-600 transition duration-300"
            >
                <FaFileDownload /> Generate Sales Report
            </button>
        </div>
    );
};

export default SalesChart;
