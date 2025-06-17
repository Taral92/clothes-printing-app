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

      setLoading(false); // Ready to render the form
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
      const res = await axios.post(
        "http://localhost:3000/api/products",
        formdata,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <form style={{ maxWidth: 600, margin: "auto" }} onSubmit={handlesubmit}>
        <h1>Create Product</h1>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleInputChange}
          required
          value={formdata.name}
        />
        <br />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleInputChange}
          value={formdata.description}
        />
        <br />
        <select name="type" onChange={handleInputChange} value={formdata.type}>
          <option value="">Select type</option>
          <option value="T-Shirt">T-Shirt</option>
          <option value="Hoodie">Hoodie</option>
          <option value="Sweatshirt">Sweatshirt</option>
          <option value="Cap">Cap</option>
          <option value="Other">Other</option>
        </select>
        <br />
        <label>Sizes:</label> <br />
        {["S", "M", "L", "XL", "XXL"].map((size) => (
          <label key={size}>
            <input
              type="checkbox"
              value={size}
              onChange={(e) => handleCheckboxChange(e, "sizes")}
            />
            {size}
          </label>
        ))}
        <br />
        <label>Colors:</label> <br />
        {["Black", "White", "Red", "Blue", "Grey"].map((color) => (
          <label key={color}>
            <input
              type="checkbox"
              value={color}
              onChange={(e) => handleCheckboxChange(e, "colors")}
            />
            {color}
          </label>
        ))}
        <br />
        <input
          type="number"
          name="basePrice"
          placeholder="Price"
          onChange={handleInputChange}
          required
          value={formdata.basePrice}
        />
        <br />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        <br />
        <button type="submit">Create Product</button>
      </form>

      <div>
        {res?.images?.map((imgUrl, idx) => (
          <img key={idx} src={imgUrl} alt={`Uploaded-${idx}`} width="150" />
        ))}
      </div>

      <button onClick={getAllProducts}>Get All Products</button>

      <div style={{ marginTop: 30 }}>
        {allProducts.map((product, i) => (
          <div key={i}>
            <h3>{product.name}</h3>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {product.images.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`product-${i}-${idx}`}
                  width="120"
                />
              ))}
            </div>
            <hr />
          </div>
        ))}
      </div>
    </>
  );
};

export default Products;