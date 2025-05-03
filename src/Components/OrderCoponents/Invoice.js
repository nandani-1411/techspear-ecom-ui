import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../logo.png"
import moment from "moment";
import displayINRCurrency from "../../Helpers/displayCurrency";

export default function Invoice({ order, onClose, isDarkMode }) {
  const invoiceRef = useRef();
// console the order
  console.log(order)

  if (!order) {
    return <p className="text-center text-gray-600">No order details available.</p>;
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const taxRate = 0.10;
  const taxAmount = order.total * taxRate;
  const grandTotal = order.total + taxAmount;

  const downloadPDF = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice-${order?.userId?.name}.pdf`);
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 shadow-md rounded-lg transition-all ${
      isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
    }`}>
      <div ref={invoiceRef} className={`p-6 transition-all ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}>

        {/* Company Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div>
          <img src={logo} alt="Company Logo" className="h-20 w-auto" />
          <h1 className="text-lg font-bold">TechSpehar</h1>
            <p className="text-sm">1234 Street Name, City, Country</p>
            <p className="text-sm">Phone: +123456789 | Email: support@techspehar.com</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold">Invoice</h2>
            <p>Order Id : { order?._id}</p>
            <p>Date: {moment(order?.createdAt).format("DD-MM-YYYY")}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-6">
          <h3 className="text-lg font-medium">Billing To:</h3>
          <p className="text-sm">{order?.userId?.name}</p>
          <p className="text-sm">{order?.userId?.email}</p>
          <p className="text-sm">{order?.addressInfo?.fullAddress}</p>
        </div>

        {/* Order Details */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-5">Order Summary</h3>
          <table className={`w-full text-sm text-left border ${
            isDarkMode ? "border-gray-700" : "border-gray-300"
          }`}>
            <thead className={`${
              isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700"
            }`}>
              <tr>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Unit Price</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {order?.orderItems?.map((product) => (
                <tr key={product?._id} className={`border ${
                  isDarkMode ? "border-gray-700" : "border-gray-300"
                }`}>
                  <td className="p-2">{product?.product?.productName}</td>
                  <td className="p-2 text-center">{product.quantity}</td>
                  <td className="p-2">{displayINRCurrency(product?.product?.price)}</td>
                  <td className="p-2 font-medium">{displayINRCurrency(product?.product?.price * product.quantity )}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment Details */}
        <div className="text-right text-lg font-medium border-t pt-4">
          <p>Subtotal: {displayINRCurrency(order?.totalAmount)}</p>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t pt-4 text-sm">
          <p>Thank you for your business!</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 text-center">
        <button
          onClick={downloadPDF}
          className={`px-6 py-2 rounded-lg shadow-md transition-all ${
            isDarkMode ? "bg-green-600 text-white hover:bg-green-500" : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          Download PDF
        </button>
        <button
          onClick={onClose}
          className={`ml-4 px-6 py-2 rounded-lg transition-all ${
            isDarkMode ? "bg-red-600 text-white hover:bg-red-500" : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
}
