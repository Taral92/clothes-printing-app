import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formdata, setFormdata] = useState({
    name: "",
    description: "",
    type: "",
    sizes: [],
    colors: [],
    basePrice: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") return navigate("/");

      // Fetch product data
      axios
        .get(`http://localhost:3000/api/products/${id}`)
        .then((res) => {
          const prod = res.data;
          setFormdata({
            name: prod.name || "",
            description: prod.description || "",
            type: prod.type || "",
            sizes: prod.sizes || [],
            colors: prod.colors || [],
            basePrice: prod.basePrice || "",
          });
        })
        .catch((err) => {
          toast.error("Failed to load product");
          navigate("/");
        });
    } catch {
      navigate("/");
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((v) => v !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    if (decoded.role !== "admin") return navigate("/");

    try {
      await axios.put(`http://localhost:3000/api/products/${id}`, formdata, {
        headers: { Authorization: `Bearer ${token}` },

      });
      
      toast.success("Product updated successfully");
      navigate("/productlist");
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-5"
      >
        <input
          type="text"
          name="name"
          value={formdata.name}
          onChange={handleChange}
          required
          placeholder="Product Name"
          className="w-full border px-4 py-2 rounded"
        />

        <textarea
          name="description"
          value={formdata.description}
          onChange={handleChange}
          placeholder="Description"
          rows={4}
          className="w-full border px-4 py-2 rounded"
        />

        <select
          name="type"
          value={formdata.type}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">Select Product Type</option>
          <option value="T-Shirt">T-Shirt</option>
          <option value="Hoodie">Hoodie</option>
          <option value="Sweatshirt">Sweatshirt</option>
          <option value="Cap">Cap</option>
          <option value="Other">Other</option>
        </select>

        <div>
          <label className="block mb-1">Sizes</label>
          <div className="flex gap-4">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <label key={size}>
                <input
                  type="checkbox"
                  value={size}
                  checked={formdata.sizes.includes(size)}
                  onChange={(e) => handleCheckboxChange(e, "sizes")}
                />{" "}
                {size}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1">Colors</label>
          <div className="flex gap-4">
            {["Black", "White", "Red", "Blue", "Grey"].map((color) => (
              <label key={color}>
                <input
                  type="checkbox"
                  value={color}
                  checked={formdata.colors.includes(color)}
                  onChange={(e) => handleCheckboxChange(e, "colors")}
                />{" "}
                {color}
              </label>
            ))}
          </div>
        </div>

        <input
          type="number"
          name="basePrice"
          value={formdata.basePrice}
          onChange={handleChange}
          placeholder="Base Price"
          required
          className="w-full border px-4 py-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;