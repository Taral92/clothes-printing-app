import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Products from "./pages/Products";
import Mockups from "./pages/Mockups";
import Navbar from "./pages/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductList from "./pages/ProductList";
import { Provider } from "react-redux";
import store from "./redux/store";
import SingleProductpage from "./pages/SingleProductpage";
import Cart from "./pages/Cart";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel.jsx";

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Landing />} />
      <Route path="/products" element={<Products />} />
      <Route path="/mockups" element={<Mockups />} />
      <Route path="/productlist" element={<ProductList />} />
      <Route path="/product/:id" element={<SingleProductpage />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<Cancel />} />
    </Routes>
    <ToastContainer />
  </BrowserRouter>
  </Provider>
);

export default App;
