import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
} from "../redux/slice";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const Cart = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.z.cartItems);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleRemove = (id) => {
    dispatch(removeFromCart({ id }));
  };

  const handleIncrement = (id) => {
    dispatch(incrementQuantity({ id }));
  };

  const handleDecrement = (id) => {
    dispatch(decrementQuantity({ id }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-md rounded-xl p-4 flex flex-col"
              >
                <img
                  src={
                    item.image ??
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={item.name}
                  className="w-full h-64 object-cover rounded-xl mb-4 border"
                />
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-700 mt-1">Price: ${item.price}</p>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleDecrement(item.id)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleIncrement(item.id)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <p className="text-gray-900 mt-2 font-medium">
                  Subtotal: ${item.price * item.quantity}
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
            Total: ${totalAmount}
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;