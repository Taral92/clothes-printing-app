import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";
import { Link } from "react-router-dom";

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://clothes-printing-backend.onrender.com/api/orders", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="p-6 animate-pulse text-gray-600">Loading orders...</p>;

  if (orders.length === 0) return <p className="p-6 text-gray-500">You have no orders yet.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">📦 Your Orders</h2>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order._id} className="border p-4 rounded-lg shadow-sm">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Total:</strong> ₹{order.total}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Ordered on:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <Link
              to={`/order/${order._id}/receipt`}
              className="text-indigo-600 hover:underline mt-2 inline-block"
            >
              🔍 View Receipt
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderStatus;