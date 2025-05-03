import React, { useState } from "react";
import OrderManagement from "../../Components/OrderCoponents/OrderManage";
import StockManagement from "../../Components/OrderCoponents/StockManagement";

const OrderPage = () => {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Tab Navigation */}
      <div className="flex justify-start space-x-8 border-b ml-5">
        {["orders", "stock"].map((tab) => (
          <button
            key={tab}
            className={`pb-2 font-semibold text-lg relative transition ${
              activeTab === tab
                ? "text-blue-600 border-b-4 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "orders" ? "📦 Manage Orders" : "📊 Manage Stock"}
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-4">
        {activeTab === "orders" ? <OrderManagement /> : <StockManagement />}
      </div>
    </div>
  );
};

export default OrderPage;