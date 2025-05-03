import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SalesChart from "../../Components/Dashboard/SalesChart";
import RevenueChart from "../../Components/Dashboard/RevenueChart";
import OrdersOverview from "../../Components/Dashboard/OrdersOverview";
import MostSoldProducts from "../../Components/Dashboard/MostSoldProduct";
import UserReviews from "../../Components/Dashboard/UserReviews";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getAllReview } from "../../features/reviewSlice";
import { getMyDashboard } from "../../features/dashboardSlice";

const mostSoldProducts = [
    { name: "Laptop", description: "High-performance laptop.", price: "$1200", stock: 50 },
    { name: "Gaming PC", description: "Powerful gaming PC.", price: "$1800", stock: 30 },
];

const Dashboard = () => {
    const dispatch = useDispatch();
    const [dashboardData, setDashboardData] = useState(null);
    const [rev, setRev] = useState([]);
    const [activeTab, setActiveTab] = useState("📊 Sales");

    const showDashboard = async () => {
        try {
            const res = await dispatch(getMyDashboard()).unwrap();
            const salesChart = res?.data.salesChart || [];
            const revenueChart = res?.data.revenueChart || [];
            const ordersOverview = res?.data.ordersOverview || {};
            const mostSoldProducts = res?.data.mostSoldProducts || [];

            const transformedSalesData = {
                labels: salesChart.map(item => item.month),
                datasets: [
                    {
                        label: "Total Sales",
                        data: salesChart.map(item => item.totalSales),
                        borderColor: "green",
                        backgroundColor: "lightgreen",
                        fill: true,
                    }
                ]
            };

            const transformedRevenueData = {
                labels: revenueChart.map(item => item.month),
                datasets: [
                    {
                        label: "Revenue",
                        data: revenueChart.map(item => item.revenue),
                        borderColor: "blue",
                        backgroundColor: "lightblue",
                        fill: true,
                    }
                ]
            };

            setDashboardData({
                ...res?.data,
                salesData: transformedSalesData,
                revenueData: transformedRevenueData,
                ordersOverview,
                mostSoldProducts,
            });

            // toast.success(res?.message);
        } catch (er) {
            toast.error(er);
            console.log(er);
        }
    };


    const getAllTheReviews = async () => {
        try {
            const response = await dispatch(getAllReview()).unwrap();
            setRev(response?.data);
            // toast.success(response?.message);
        } catch (er) {
            toast.error(er);
            console.log(er);
        }
    };

    useEffect(() => {
        showDashboard();
        getAllTheReviews();
    }, [dispatch]);

    const tabs = [
        { name: "📊 Sales", component: <SalesChart data={dashboardData?.salesData} /> },
        { name: "💰 Revenue", component: <RevenueChart data={dashboardData?.revenueData} /> },
        {
            name: "🛍️ Orders", component: <OrdersOverview totalOrders={dashboardData?.ordersOverview?.totalOrders || 0}
                pendingOrders={dashboardData?.ordersOverview?.pendingOrders || 0}     completedOrders={dashboardData?.ordersOverview?.completedOrders } />
        },
        { name: "🔥 Most Sold Product", component: <MostSoldProducts  products={dashboardData?.mostSoldProducts}  /> },
        { name: "⭐ Reviews", component: <UserReviews reviews={rev} /> },
    ];
    return (
        <div className="p-6">
            {/* Tabs for small to medium screens */}
            {dashboardData && (
                <div className="block xl:hidden">
                    <div className="flex gap-4 pb-3 mb-6 border-b border-gray-300 dark:border-gray-600 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`relative px-6 py-3 text-lg font-semibold transition duration-300 rounded-lg shadow-md focus:outline-none ${activeTab === tab.name
                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                        : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                                    }`}
                            >
                                {activeTab === tab.name && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-blue-500 opacity-20 rounded-lg"
                                    />
                                )}
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    <div className="w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                {tabs.find((tab) => tab.name === activeTab)?.component}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Grid layout for large screens */}
            {dashboardData && (
                <div className="hidden xl:grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <SalesChart data={dashboardData?.salesData} />
                    <RevenueChart data={dashboardData?.revenueData} />
                    <OrdersOverview totalOrders={dashboardData?.ordersOverview?.totalOrders || 0}
                pendingOrders={dashboardData?.ordersOverview?.pendingOrders || 0}     completedOrders={dashboardData?.ordersOverview?.completedOrders || 0} />
                    <MostSoldProducts  products={dashboardData?.mostSoldProducts}  />
                    <div className="col-span-1 xl:col-span-2">
                        <UserReviews reviews={rev} />
                    </div>
                </div>
            )}
        </div>
    );

};

export default Dashboard;
