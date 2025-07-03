import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
} from "../redux/slice";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getToken } from "../utils/auth";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.z.cartItems);

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.warning("Please login to access cart.");
      navigate("/login");
    }
  }, [navigate]);

  const totalAmount = cart.reduce(
    (total, item) => total + item.basePrice * item.quantity,
    0
  );

  const handleRemove = (id) => {
    dispatch(removeFromCart({ id }));
    toast.info("Product removed from cart");
  };

  const handleIncrement = (id) => {
    dispatch(incrementQuantity({ id }));
  };

  const handleDecrement = (id) => {
    dispatch(decrementQuantity({ id }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    const products = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      size: item.size || "",
      color: item.color || "",
      basePrice: item.basePrice,
      images: item.images,
    }));

    try {
      setLoading(true);

      const orderRes = await axios.post(
        "https://clothes-printing-backend.onrender.com/api/orders",
        {
          products,
          total: totalAmount,
          shippingAddress: address,
        },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      const orderId = orderRes.data._id;

      const checkoutRes = await axios.post(
        "https://clothes-printing-backend.onrender.com/api/payment/create-checkout-session",
        {
          orderId,
          cartItems: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.basePrice * 100,
            quantity: item.quantity,
            image: item.images?.[0] || "",
          })),
        },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      if (checkoutRes.data.url) {
        window.location.href = checkoutRes.data.url;
      } else {
        toast.error("Failed to create payment session.");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-6">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cart.map((item) => (
              <div key={item.id} className="bg-white shadow-md rounded-xl p-4">
                <img
                  src={
                    item.images?.[0] ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={item.name}
                  className="w-full h-64 object-cover rounded-xl mb-4 border"
                />
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-700 mt-1">Price: ₹{item.basePrice}</p>

                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleDecrement(item.id)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-lg">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrement(item.id)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                <p className="text-gray-900 mt-2 font-medium">
                  Subtotal: ₹{item.basePrice * item.quantity}
                </p>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-right text-2xl font-bold">
            Total: ₹{totalAmount}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => setShowOrderForm(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700"
            >
              Place Order
            </button>
          </div>

          {/* Order Form Modal */}
          {showOrderForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h3 className="text-xl font-semibold mb-4">
                  Shipping Address
                </h3>
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  {Object.keys(address).map((field) => (
                    <input
                      key={field}
                      type="text"
                      name={field}
                      required
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      value={address[field]}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border rounded"
                    />
                  ))}

                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowOrderForm(false)}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900"
                    >
                      {loading ? "Placing Order..." : "Continue to Payment"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;