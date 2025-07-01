import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slice";
import { jwtDecode } from "jwt-decode";

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        ...product,
        id: product._id,
        quantity: 1,
      })
    );
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://clothes-printing-backend.onrender.com/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
  };

  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 ease-in-out border border-gray-200 hover:border-gray-300"
        >
          <div className="overflow-hidden rounded-t-2xl">
            <img
              src={
                product.images?.[0] ||
                "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt={product.name}
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="p-4 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {product.name}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                ${product.basePrice || product.price}
              </p>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleAddToCart(product)}
                className="flex-1 bg-green-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-green-700 shadow-sm transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => navigate(`/product/${product._id}`)}
                className="flex-1 bg-gray-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-gray-800 shadow-sm transition"
              >
                View
              </button>
            </div>

            {isAdmin && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate(`/update-product/${product._id}`)}
                  className="flex-1 bg-yellow-500 text-white text-sm px-3 py-2 rounded hover:bg-yellow-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="flex-1 bg-red-500 text-white text-sm px-3 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;