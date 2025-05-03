import moment from "moment";
import React from "react";
import * as XLSX from "xlsx";

const PaymentReport = ({ payments }) => {
  const downloadExcel = () => {
    const wb = XLSX.utils.book_new();

    // 1️⃣ Overall Summary Data
    const totalEarnings = payments.filter((p) => p.status === "Completed").reduce((sum, p) => sum + p.amount, 0);
    const totalRefunded = payments.filter((p) => p.status === "Refunded").reduce((sum, p) => sum + p.amount, 0);
    const totalCanceled = payments.filter((p) => p.status === "Canceled").reduce((sum, p) => sum + p.amount, 0);
    const totalTransactions = payments.length;

    const summaryData = [
      ["Total Earnings", `${totalEarnings}`],
      ["Total Refunded", `${totalRefunded}`],
      ["Total Canceled", `${totalCanceled}`],
      ["Total Transactions", totalTransactions],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, "Overall Summary");

    // 2️⃣ All Transactions Data
    const allTransactionsSheet = XLSX.utils.json_to_sheet(
      payments.map((p) => ({
        "Order ID": p?.orderId,
        Customer: p?.userId?.name,
        "Payment Method": p?.paymentMethod,
        "Transaction ID": p.transactionId,
        "Date": moment(p?.createdAt).format("DD-MM-YYYY"),
        Status: p.status,
        Amount: p.amount,
      }))
    );
    XLSX.utils.book_append_sheet(wb, allTransactionsSheet, "All Transactions");

    // 3️⃣ Grouping Payments by Method
    const paymentSummary = payments.reduce((acc, payment) => {
      const { paymentMethod, status, amount } = payment;

      if (!acc[paymentMethod]) {
        acc[paymentMethod] = { transactions: 0, completed: 0, refunded: 0, canceled: 0, total: 0 };
      }

      acc[paymentMethod].transactions += 1;
      acc[paymentMethod].total += amount;

      if (status === "Completed") acc[paymentMethod].completed += amount;
      else if (status === "Refunded") acc[paymentMethod].refunded += amount;
      else if (status === "Canceled") acc[paymentMethod].canceled += amount;

      return acc;
    }, {});

    // 4️⃣ Separate Sheets for Each Payment Method
    Object.keys(paymentSummary).forEach((method) => {
      const methodData = [
        ["Total Transactions", paymentSummary[method].transactions],
        ["Completed Earnings", `$${paymentSummary[method].completed}`],
        ["Refunded Amount", `$${paymentSummary[method].refunded}`],
        ["Canceled Amount", `$${paymentSummary[method].canceled}`],
        ["Total Processed", `$${paymentSummary[method].total}`],
      ];

      const methodSheet = XLSX.utils.aoa_to_sheet(methodData);
      XLSX.utils.book_append_sheet(wb, methodSheet, method);
    });

    // Save the Excel file
    XLSX.writeFile(wb, "payment_report.xlsx");
  };

  return (
    <div className="container mx-auto mt-6 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-start">📊 Payment Report</h2>
      <div className="flex justify-start">
        <button
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          onClick={downloadExcel}
        >
          📥 Export to Excel
        </button>
      </div>
    </div>
  );
};

export default PaymentReport;
