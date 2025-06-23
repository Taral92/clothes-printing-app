import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "../redux/slice";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.z.cartItems);
  const existingItem = cartItems.find((item) => item.id === id);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(existingItem?.quantity || 1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get(
          `http://localhost:3000/api/products/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleIncrement = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    if (existingItem) {
      dispatch(updateQuantity({ id, quantity: newQty }));
    }
  };

  const handleDecrement = () => {
    const newQty = Math.max(1, quantity - 1);
    setQuantity(newQty);
    if (existingItem) {
      dispatch(updateQuantity({ id, quantity: newQty }));
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.basePrice,
        image: product.images?.[0],
        quantity,
      })
    );
  };

  const checkout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/api/payment/create-checkout-session",
        {
          cartItems: [
            {
              id: product._id,
              name: product.name,
              price: (product.basePrice || product.price) * 100, // Convert $ to paise
              image: product.images?.[0],
              quantity,
            },
          ],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        console.error("Stripe session URL not found.");
      }
    } catch (error) {
      console.error("Checkout error:", error.response?.data || error.message);
    }
  };
  if (!product) {
    return <p className="p-8 text-gray-500 animate-pulse">Loading...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      <img
        src={
          product.images?.[0] ||
          "https://via.placeholder.com/400x300?text=No+Image"
        }
        alt={product.name}
        className="w-full h-[26rem] object-cover rounded-2xl border shadow-lg transition-transform duration-300 hover:scale-105"
      />

      <div className="space-y-5">
        <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
        <p className="text-2xl text-green-600 font-semibold">
          ${product.basePrice || product.price}
        </p>
        <p className="text-gray-600 leading-relaxed">{product.description}</p>

        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">
            Quantity:
          </label>
          <div className="flex items-center border rounded-lg w-fit overflow-hidden">
            <button
              onClick={handleDecrement}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg"
            >
              −
            </button>
            <span className="px-6 py-2 text-lg font-medium">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={handleAddToCart}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
          >
            Add to Cart
          </button>
          <button
            onClick={checkout}
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition duration-200"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
