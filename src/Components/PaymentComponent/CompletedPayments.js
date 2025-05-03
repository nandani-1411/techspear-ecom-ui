import React from "react";
import PaymentReport from "./PaymentReport"; // Import the report component
import moment from "moment"
const CompletedPayments = ({ payments }) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Payment Details</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Order ID</th>
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Payment Method</th>
              <th className="px-4 py-2 border">Razorpay Payment ID</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments
              .filter((payment) => payment.status === "Completed" || payment.status === "Canceled" || payment.status === "Pending")
              .map((payment) => (
                <tr key={payment.orderId} className="border-t">
                  <td className="px-4 py-2 border">{moment(payment?.createdAt).format("DD-MM-YYYY")}</td>
                  <td className="px-4 py-2 border">{payment?.orderId}</td>
                  <td className="px-4 py-2 border">{payment?.userId?.name}</td>
                  <td className="px-4 py-2 border">{payment.paymentMethod}</td>
                  <td className="px-4 py-2 border">{payment?.
                    razorpayPaymentId || "Null"
                  }</td>
                  <td className="px-4 py-2 border">
                    {payment.status === "Completed"
                      ? "✅ Completed"
                      : payment.status === "Pending"
                        ? "⏳ Pending"
                        : "❌ Canceled"}
                  </td>
                  <td className="px-4 py-2 border">{payment.amount}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Include the Payment Report Below */}
      <PaymentReport payments={payments} />
    </div>
  );
};

export default CompletedPayments;
