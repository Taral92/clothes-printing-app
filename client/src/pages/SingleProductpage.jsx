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
        price: product.basePrice || product.price,
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
              price: product.basePrice || product.price,
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
      }
    } catch (error) {
      console.error("Checkout error:", error.message);
    }
  };

  if (!product) {
    return <p className="p-8 text-gray-500">Loading...</p>;
  }

  return (
    <div className="p-8 flex flex-col md:flex-row gap-10">
      <img
        src={
          product.images?.[0] ||
          "https://via.placeholder.com/400x300?text=No+Image"
        }
        alt={product.name}
        className="w-full md:w-1/2 h-96 object-cover rounded-xl border shadow-md"
      />
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-xl text-gray-700 mt-2">₹{product.price}</p>
        <p className="text-gray-600 mt-2">{product.description}</p>

        <div className="flex items-center gap-4 mt-6">
          <label className="text-gray-700 font-medium">Quantity:</label>
          <div className="flex items-center border rounded-lg">
            <button onClick={handleDecrement} className="px-3 py-1">
              -
            </button>
            <span className="px-4">{quantity}</span>
            <button onClick={handleIncrement} className="px-3 py-1">
              +
            </button>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Add to Cart
          </button>
          <button
            onClick={checkout}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
