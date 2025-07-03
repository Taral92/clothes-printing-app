import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slice";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const cartItems = useSelector((state) => state.z.cartItems);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.role === "admin");

        const res = await axios.get("https://clothes-printing-backend.onrender.com/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
        toast.error("Failed to load products");
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleAddToCart = (product) => {
    const alreadyInCart = cartItems.some((item) => item.id === product._id);
    if (alreadyInCart) {
      toast.info("Product already in cart");
      return;
    }

    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        quantity: 1,
        basePrice: product.basePrice,
        images: product.images,
        size: "",
        color: "",
      })
    );

    toast.success("Product added to cart");
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://clothes-printing-backend.onrender.com/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch (error) {
      console.error("Error deleting product:", error.message);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen w-full px-6 py-14 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-white text-4xl font-extrabold text-center mb-12 drop-shadow-lg">
        ✨ Our Premium Collections
      </h1>

      {products.length === 0 ? (
        <p className="text-white text-center text-lg mt-10">
          No products available.
        </p>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(255,255,255,0.15)] duration-300 group relative"
            >
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={
                    product.images?.[0] ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={product.name}
                  className="w-full h-60 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="mt-5 text-white space-y-2">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-300">{product.description}</p>
                <p className="text-lg font-bold text-pink-400">
                  ₹{product.basePrice || product.price}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl text-sm font-medium shadow-lg"
                >
                  🛒 Add to Cart
                </button>
                <button
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-xl text-sm font-medium shadow-lg"
                >
                  View
                </button>
              </div>

              {isAdmin && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() =>
                      navigate(`/update-product/${product._id}`)
                    }
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-2 rounded-xl"
                  >
                    ✏️ Update
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded-xl"
                  >
                    ❌ Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;