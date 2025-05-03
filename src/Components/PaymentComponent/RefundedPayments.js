import React, { useState } from "react";

const RefundedPayments = ({ payments, handleRefund }) => {
  const [refundMethod, setRefundMethod] = useState("");
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [refundedTransactions, setRefundedTransactions] = useState([]);

  const filteredRefunds = payments.filter(
    (payment) => payment.status === "Refunded" && (!refundMethod || payment.refundMethod === refundMethod)
  );

  const confirmRefund = (transactionId) => {
    handleRefund(transactionId);
    setRefundedTransactions([...refundedTransactions, transactionId]);
    setSelectedRefund(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Title & Filter in One Line */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">🔄 Refunded Transactions</h2>
        <select
          className="px-3 py-2 border rounded-md text-md"
          value={refundMethod}
          onChange={(e) => setRefundMethod(e.target.value)}
        >
          <option value="">All Methods</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="PayPal">PayPal</option>
          <option value="Credit Card">Credit Card</option>
        </select>
      </div>

      {/* Refund Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-md">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Transaction ID</th>
              <th className="px-3 py-2">Refund Method</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRefunds.map((payment) => (
              <tr key={payment.transactionId} className="border-t text-center">
                <td className="px-3 py-2">{payment.email}</td>
                <td className="px-3 py-2">{payment.transactionId}</td>
                <td className="px-3 py-2">{payment.refundMethod}</td>
                <td className="px-3 py-2">${payment.amount}</td>
                <td className="px-3 py-2">
                  {refundedTransactions.includes(payment.transactionId) ? (
                    <span className="text-green-600 font-semibold">Refunded</span>
                  ) : (
                    <button
                      onClick={() => setSelectedRefund(payment)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Process
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Refunds Message */}
      {filteredRefunds.length === 0 && (
        <p className="text-center text-gray-500 mt-4 text-sm">No refunded transactions found.</p>
      )}

      {/* Refund Confirmation Popup */}
      {selectedRefund && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-3 text-center">Confirm Refund</h3>
            <p className="text-md mb-2"><b>Email:</b> {selectedRefund.email}</p>
            <p className="text-md mb-2"><b>Method:</b> {selectedRefund.refundMethod}</p>
            <p className="text-md mb-4"><b>Amount:</b> ${selectedRefund.amount}</p>
            
            <div className="flex justify-between">
              <button
                onClick={() => confirmRefund(selectedRefund.transactionId)}
                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-md"
              >
                ✅ Confirm
              </button>
              <button
                onClick={() => setSelectedRefund(null)}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-md"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundedPayments;
