import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/auth";

const OrderForm = ({ mockupImage }) => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.z.cartItems);

  const [address, setAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + item.basePrice * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const products = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      size: item.size || "",
      color: item.color || "",
    }));

    try {
      setLoading(true);
      const token = getToken();

  
      const orderRes = await axios.post(
        "https://clothes-printing-backend.onrender.com/api/orders",
        {
          products,
          total,
          shippingAddress: address,
          mockupImage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const orderId = orderRes.data._id;

      const paymentRes = await axios.post(
        "https://clothes-printing-backend.onrender.com/api/payment/create-checkout-session",
        {
          orderId,
          cartItems: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            image: item.image,
            price: item.basePrice * 100,
            quantity: item.quantity,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (paymentRes.data.url) {
        const redirectUrl = new URL(paymentRes.data.url);
        redirectUrl.searchParams.set("orderId", orderId);
        redirectUrl.pathname = `/order/${orderId}/receipt`; 
        window.location.href = redirectUrl.toString();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">Shipping Address</h3>
      {[
        { name: "address", label: "Address" },
        { name: "city", label: "City" },
        { name: "postalCode", label: "Postal Code" },
        { name: "country", label: "Country" },
      ].map(({ name, label }) => (
        <input
          key={name}
          type="text"
          name={name}
          value={address[name]}
          onChange={handleChange}
          required
          placeholder={label}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
        />
      ))}

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
      >
        {loading ? "Placing Order..." : "Place Order & Pay"}
      </button>
    </form>
  );
};

export default OrderForm;