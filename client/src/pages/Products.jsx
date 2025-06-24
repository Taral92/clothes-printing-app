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
    if (!token) return navigate("/");

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") return navigate("/");
      setLoading(false);
    } catch (err) {
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
      new Promise((res, rej) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => res(reader.result);
        reader.onerror = rej;
      });
    const base64Images = await Promise.all(files.map(toBase64));
    setFormdata((prev) => ({ ...prev, images: base64Images }));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") return navigate("/");
      const res = await axios.post(
        "http://localhost:3000/api/products",
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Product created successfully");
      setRes(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Upload failed");
    }
  };

  const getAllProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/products");
      setAllProducts(res.data);
      toast.success("Fetched all products");
    } catch (err) {
      toast.error("Failed to fetch products");
    }
  };

  if (loading)
    return (
      <div className="text-center text-xl font-semibold mt-20">Loading...</div>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <form
        onSubmit={handlesubmit}
        className="bg-white p-8 shadow-xl rounded-2xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          required
          value={formdata.name}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="description"
          placeholder="Description"
          rows={4}
          value={formdata.description}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="type"
          value={formdata.type}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Product Type</option>
          <option value="T-Shirt">T-Shirt</option>
          <option value="Hoodie">Hoodie</option>
          <option value="Sweatshirt">Sweatshirt</option>
          <option value="Cap">Cap</option>
          <option value="Other">Other</option>
        </select>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Sizes</label>
          <div className="flex flex-wrap gap-4">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <label key={size} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={size}
                  onChange={(e) => handleCheckboxChange(e, "sizes")}
                  className="accent-blue-600"
                />
                <span className="text-gray-600">{size}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Colors</label>
          <div className="flex flex-wrap gap-4">
            {["Black", "White", "Red", "Blue", "Grey"].map((color) => (
              <label key={color} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={color}
                  onChange={(e) => handleCheckboxChange(e, "colors")}
                  className="accent-blue-600"
                />
                <span className="text-gray-600">{color}</span>
              </label>
            ))}
          </div>
        </div>

        <input
          type="number"
          name="basePrice"
          placeholder="Base Price"
          required
          value={formdata.basePrice}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Upload Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Create Product
        </button>
      </form>

      {res?.images?.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-3">Uploaded Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {res.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`uploaded-${i}`}
                className="rounded-lg border shadow-md object-cover h-36 w-full"
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 text-center">
        <button
          onClick={getAllProducts}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition"
        >
          Load All Products
        </button>
      </div>

      {allProducts.length > 0 && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {allProducts.map((prod, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md p-4">
              <h4 className="text-lg font-semibold mb-2">{prod.name}</h4>
              <div className="flex flex-wrap gap-3">
                {prod.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`product-${idx}-${i}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;