import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [error, setError] = useState(false);
  useEffect(() => {
    console.log("orderId from searchParams:", orderId);
  }, [orderId]);
  useEffect(() => {
    if (!orderId) {
      setError(true);
    }
  }, [orderId]);

  const handleContinueShopping = () => {
    navigate("/productlist");
  };

  const handleViewReceipt = () => {
    if (orderId) {
      console.log("orderId from handleViewReceipt:", orderId);
      navigate(`/order/${orderId}/receipt`);
    }
  };

  if (error) {
    return (
      <div className="p-10 text-center text-red-600 text-xl">
        ❌ Invalid or missing order ID. Unable to display receipt.
      </div>
    );
  }

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        ✅ Payment Successful!
      </h1>
      <p className="text-gray-700 mb-6">Thank you for your order 🎉</p>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleContinueShopping}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Continue Shopping
        </button>
        <button
          onClick={handleViewReceipt}
          disabled={!orderId}
          className={`bg-indigo-600 text-white px-6 py-3 rounded-lg transition ${
            !orderId ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
          }`}
        >
          View Order Receipt
        </button>
      </div>
    </div>
  );
};

export default Success;
