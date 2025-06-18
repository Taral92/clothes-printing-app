import React from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Cart = () => {
  const cart = useSelector((state) => state.cart.items);

  const totalAmount = cart.reduce(
    (total, item) => total + item.basePrice * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;

      const res = await axios.post(
        "http://localhost:3000/api/stripe/create-checkout-session",
        { cartItems: cart }
      );

      await stripe.redirectToCheckout({ sessionId: res.data.id });
    } catch (err) {
      console.error("Checkout error", err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between border-b py-3">
              <span>{item.name}</span>
              <span>
                ₹{item.basePrice} × {item.quantity}
              </span>
            </div>
          ))}

          <div className="text-right mt-4 font-semibold text-lg">
            Total: ₹{totalAmount}
          </div>

          <button
            onClick={handleCheckout}
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
          >
            💳 Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
