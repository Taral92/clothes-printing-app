const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cookieParser = require("cookie-parser");
connectDB();
const cors = require("cors");


const app = express();
app.use(cors({
    credentials:true,
    origin:"http://localhost:5173"
}));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
