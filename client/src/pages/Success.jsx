// Success.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
    const navigate = useNavigate();

    const handleBackToCart = () => {
        navigate("/productlist");
    };
    
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful 🎉</h1>
      <p className="text-gray-700">Thank you for your order!</p>
      <button
        onClick={handleBackToCart}
        className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
      >
        Go Back to Cart
      </button>
    </div>
  );
};

export default Success;