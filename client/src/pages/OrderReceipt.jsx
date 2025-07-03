import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../utils/auth";

const OrderReceipt = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `https://clothes-printing-backend.onrender.com/api/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        navigate("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  if (loading) return <p className="p-6 animate-pulse text-gray-600">Loading...</p>;

  if (!order) return <p className="p-6 text-red-500">Order not found!</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
        ✅ Order Confirmation
      </h1>

      <div className="space-y-4 text-gray-800">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total:</strong> ₹{order.total}</p>
        <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>

        <div>
          <h3 className="text-xl font-semibold mt-6 mb-2">📦 Products:</h3>
          <ul className="list-disc pl-6 space-y-1">
            {order.products.map((item, i) => (
              <li key={i}>
                <p>🛍️ <strong>{item.name}</strong> — {item.quantity} pcs</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">📍 Shipping Address:</h3>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderReceipt;