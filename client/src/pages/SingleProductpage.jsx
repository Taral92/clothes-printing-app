import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slice";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get(
          `http://localhost:3000/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity }));
    }
  };

  if (!product) return <p className="p-8 text-gray-500">Loading...</p>;

  return (
    <div className="p-8 flex flex-col md:flex-row gap-10">
      <img
        src={
          product.images?.[0] ||
          "https://via.placeholder.com/400x300?text=No+Image"
        }
        alt={product.name}
        className="w-full md:w-1/2 h-96 object-cover object-center rounded-xl border shadow-md"
      />
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-xl text-gray-700 mb-4">₹{product.basePrice}</p>
        <p className="text-gray-600 mb-6">{product.description}</p>

        <div className="flex items-center gap-4 mb-6">
          <label className="text-gray-700 font-medium">Quantity:</label>
          <div className="flex items-center border rounded-lg">
            <button
              className="px-3 py-1 text-lg font-bold text-gray-700 hover:bg-gray-100"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </button>
            <span className="px-4">{quantity}</span>
            <button
              className="px-3 py-1 text-lg font-bold text-gray-700 hover:bg-gray-100"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Add to Cart
          </button>

          <button
            onClick={async () => {
              try {
                const res = await axios.post(
                  "http://localhost:3000/api/payment/create-checkout-session",
                  {
                    cartItems: [{ ...product, quantity }],
                  }
                );
                window.location.href = res.data.url;
              } catch (err) {
                console.error("Checkout error", err);
              }
            }}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Checkout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
