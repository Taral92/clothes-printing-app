const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

connectDB();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);

app.use(errorHandler);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
