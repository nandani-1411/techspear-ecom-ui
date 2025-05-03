import React from 'react';
import { FaShoppingCart, FaHourglassHalf, FaCheckCircle } from 'react-icons/fa';

const OrdersOverview = ({ totalOrders, pendingOrders, completedOrders }) => (
    <div className="bg-white p-6 rounded-lg shadow-2xl border-2 border-yellow-400">
        <h3 className="text-xl font-semibold flex items-center gap-2">🛍️ Orders Overview</h3>
        
        <div className="mt-4 grid grid-cols-1 gap-4">
            {/* Total Orders */}
            <div className="flex items-center gap-4 p-4 bg-blue-100 rounded-lg shadow-md hover:bg-blue-200 transition duration-300">
                <FaShoppingCart className="text-blue-600 text-2xl" />
                <span className="font-medium">Total Orders: {totalOrders}</span>
            </div>

            {/* Pending Orders */}
            <div className="flex items-center gap-4 p-4 bg-yellow-100 rounded-lg shadow-md hover:bg-yellow-200 transition duration-300">
                <FaHourglassHalf className="text-yellow-600 text-2xl" />
                <span className="font-medium">Pending Orders: {pendingOrders}</span>
            </div>

            {/* Completed Orders */}
            <div className="flex items-center gap-4 p-4 bg-green-100 rounded-lg shadow-md hover:bg-green-200 transition duration-300">
                <FaCheckCircle className="text-green-600 text-2xl" />
                <span className="font-medium">Completed Orders: {completedOrders}</span>
            </div>
        </div>
    </div>
);

export default OrdersOverview;
