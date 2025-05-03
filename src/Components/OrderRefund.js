import React from "react";

export default function RefundModal({ orderId, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Refund Process
        </h2>
        <p className="text-gray-600 text-center">
          Your refund request for <strong>{orderId}</strong> has been received.
        </p>

        <div className="bg-gray-100 p-4 rounded-md mt-4">
          <h3 className="text-lg font-semibold">Refund Steps:</h3>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>📩 Confirmation email sent with refund details.</li>
            <li>📦 IC will collect your order within 3-5 business days.</li>
            <li>💰 Refund will be processed to your original payment method.</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
}
