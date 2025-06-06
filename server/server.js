const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

connectDB();

const app = express();

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
