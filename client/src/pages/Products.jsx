import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Products = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formdata, setFormdata] = useState({
    name: "",
    description: "",
    type: "",
    sizes: [],
    colors: [],
    basePrice: "",
    images: [],
  });
  const [allProducts, setAllProducts] = useState([]);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found");
      navigate("/");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);

      if (decodedToken.role !== "admin") {
        navigate("/");
        return;
      }

      setLoading(false);
    } catch (error) {
      console.log("Invalid token:", error);
      navigate("/");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

    const base64Images = await Promise.all(files.map((file) => toBase64(file)));
    setFormdata((prev) => ({ ...prev, images: base64Images }));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      const decodedToken = jwtDecode(token);
      if (decodedToken.role !== "admin") {
        navigate("/");
        return;
      }
      const res = await axios.post(
        "http://localhost:3000/api/products",
        formdata,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Product created successfully");
      setRes(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Upload failed");
    }
  };

  const getAllProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/products");
      setAllProducts(res.data);
      toast.success("Fetched all products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    }
  };

  if (loading)
    return <h1 className="text-center text-xl font-semibold">Loading...</h1>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <form
        onSubmit={handlesubmit}
        className="space-y-4 bg-white p-6 shadow-md rounded-xl"
      >
        <h1 className="text-2xl font-bold mb-4">Create Product</h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleInputChange}
          value={formdata.name}
          required
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleInputChange}
          value={formdata.description}
          className="w-full border rounded px-3 py-2"
        />

        <select
          name="type"
          onChange={handleInputChange}
          value={formdata.type}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select type</option>
          <option value="T-Shirt">T-Shirt</option>
          <option value="Hoodie">Hoodie</option>
          <option value="Sweatshirt">Sweatshirt</option>
          <option value="Cap">Cap</option>
          <option value="Other">Other</option>
        </select>

        <div>
          <label className="font-medium">Sizes:</label>
          <div className="flex gap-3 flex-wrap mt-1">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <label key={size} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  value={size}
                  onChange={(e) => handleCheckboxChange(e, "sizes")}
                />
                {size}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="font-medium">Colors:</label>
          <div className="flex gap-3 flex-wrap mt-1">
            {["Black", "White", "Red", "Blue", "Grey"].map((color) => (
              <label key={color} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  value={color}
                  onChange={(e) => handleCheckboxChange(e, "colors")}
                />
                {color}
              </label>
            ))}
          </div>
        </div>

        <input
          type="number"
          name="basePrice"
          placeholder="Price"
          onChange={handleInputChange}
          required
          value={formdata.basePrice}
          className="w-full border rounded px-3 py-2"
        />

      
     <label className="block">
     <span className="text-gray-700">Upload Images</span>
     <input
       type="file"
       multiple
       accept="image/*"
       onChange={handleFileChange}
       className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
     />
   </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Product
        </button>
      </form>

      {res?.images?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-2">Uploaded Images</h2>
          <div className="flex gap-4 flex-wrap">
            {res.images.map((imgUrl, idx) => (
              <img
                key={idx}
                src={imgUrl}
                alt={`Uploaded-${idx}`}
                className="w-36 h-36 object-cover rounded border"
              />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={getAllProducts}
        className="mt-8 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Get All Products
      </button>

      <div className="mt-8 space-y-8">
        {allProducts.map((product, i) => (
          <div key={i} className="border p-4 rounded-md shadow-sm">
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <div className="flex gap-4 flex-wrap">
              {product.images.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`product-${i}-${idx}`}
                  className="w-32 h-32 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
