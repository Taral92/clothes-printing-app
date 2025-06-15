import React, { useState } from "react";

const Products = () => {
    const [formdata , setFormdata] = useState({
        name:"",
        description:"",
        type:"",
        sizes:[],
        colors:[],
        basePrice:"",
        images:[],
    })
  const handlesubmit = () => {};
  const handleInputChange = (e) => {
    setFormdata({...formdata,[e.target.name]:e.target.value})
  };
  const handleCheckboxChange = () => {
    
  };
  return (
    <div>
      <form style={{ maxWidth: 600, margin: "auto" }} onSubmit={handlesubmit}>
        <h1> Create Products</h1>
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
          onChange={handleInputChange}
          placeholder="Description"
          name="description"
          id="des"
          value={formdata.description}
        ></textarea>
        <br />
        <select value={formdata.type} name="type" onChange={handleInputChange} id="x">
          <option>T-Shirt</option>
          <option>Hoodie</option>
          <option>Sweatshirt</option>
          <option>Cap</option>
          <option>Other</option> <br />
        </select>
        <br />
        <label htmlFor="sizes">Sizes:</label> <br />
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
        <label>Colors:</label> <br />
        {["Black", "White", "Red", "Blue", "Grey"].map((color) => (
          <label key={color}>
            <input 
              name="colors"
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
        <input type="file" multiple accept="image/*" onChange={handleInputChange} /> <br />
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default Products;
