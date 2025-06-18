import React from "react";
import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled ❌</h1>
      <p className="text-gray-700 mb-4">No worries, you can try again anytime.</p>
      <Link
        to="/productlist"
        className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
      >
        Go Back to Cart
      </Link>
    </div>
  );
};

export default Cancel;