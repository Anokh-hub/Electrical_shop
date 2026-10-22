const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");


const productRoutes = require("./routes/productRouter");
const authRoutes = require("./routes/authRouter");
const orderRoutes = require("./routes/orderRouter");
const dashboardRoutes = require("./routes/dashboardRouter");
const reportRoutes = require("./routes/reportRouter");
const customerRoutes = require("./routes/customerRouter");
const supplierRoutes = require("./routes/supplierRouter");
const purchaseRoutes = require("./routes/purchaseRouter");
const stockMovementRoutes = require("./routes/stockmovementRouter");
const salesRoutes = require("./routes/saleRouter");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/stock-movements", stockMovementRoutes);
app.use("/api/sales", salesRoutes);


app.get("/", (req, res) => {
    res.send("ShopNet Backend is working properly!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});