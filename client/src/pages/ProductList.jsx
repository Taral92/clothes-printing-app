import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slice"; // make sure path is correct

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:3000/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map(
        (product) => (
          console.log("Image path:", product.image),
          (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition"
            >
              <img
                src={
                  product.images && product.images[0]
                    ? product.images[0]
                    : "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={product.name}
               className="w-full h-64 object-cover object-center rounded-xl border border-gray-200 hover:border-gray-400  hover:shadow-xl transition duration-300 ease-in-out hover:scale-105"
              />
              <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
              <p className="text-gray-600">₹{product.price}</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  View
                </button>
              </div>
            </div>
          )
        )
      )}
    </div>
  );
};

export default ProductList;






