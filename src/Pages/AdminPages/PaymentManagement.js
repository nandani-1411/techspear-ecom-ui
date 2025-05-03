import React, { useEffect, useState } from "react";
import CompletedPayments from "../../Components/PaymentComponent/CompletedPayments";
import RefundedPayments from "../../Components/PaymentComponent/RefundedPayments";
import { useDispatch } from "react-redux";
import { getAllPayment } from "../../features/paymentSlice";
import { toast } from "react-toastify";

const PaymentManagement = () => {
  const [activeTab, setActiveTab] = useState("completed"); // Default: Completed Payments

  const [payments, setPayments] = useState([])

  const dispatch = useDispatch();

  const getAllPayments = async () => {
    try {
      const rs = await dispatch(getAllPayment()).unwrap();
      setPayments(rs?.data)
      toast.success(rs?.message)
      console.log(rs)
      console.log(payments)

    }
    catch (er) {
      toast.error(er)
    }
  }

  useEffect(() => {
    getAllPayments()
  }, [dispatch])



  const handleRefund = (transactionId) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.transactionId === transactionId ? { ...payment, status: "Refunded", refundMethod: "Bank Transfer" } : payment
      )
    );
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Tab Navigation */}
      <div className="flex justify-start space-x-8 border-b ml-5">
        {["completed", "refunded"].map((tab) => (
          <button
            key={tab}
            className={`pb-2 font-semibold text-lg relative transition ${activeTab === tab
                ? "text-blue-600 border-b-4 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "completed" ? "✅ Completed Payments" : "🔄 Refunded Payments"}
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-4">
        {activeTab === "completed" ? (
          <CompletedPayments payments={payments} />
        ) : (
          <RefundedPayments payments={payments} handleRefund={handleRefund} />
        )}
      </div>
    </div>

  );
};

export default PaymentManagement;
