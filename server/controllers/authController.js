const usermodel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;
const cookie = require("cookie");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userexists = await usermodel.findOne({ email });
  if (userexists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const role = email === "taral999@gmail.com" ? "admin" : "user";
    const user = await usermodel.create({
      name,
      email,
      password: hashedPassword,
      role,
      cart: [],
    });

    const token = jwt.sign({ id: user._id, role: user.role }, secretKey, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.status(201).json({
      message: `${name} registered successfully`,
      user: user.name,
      role: user.role,
      token: token,
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await usermodel.findOne({ email }).populate("cart.productId");

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, secretKey, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "User logged in successfully",
    user: user.name,
    role: user.role,
    token: token,
    cart: user.cart,
  });
};
module.exports = { register, login };
