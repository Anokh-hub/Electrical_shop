
import { useEffect, useState } from "react";
import api from "../services/api";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";

export default function Admin() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get("/dashboard");
                setDashboard(response.data.dashboard);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Dashboard load nahi hua. Login aur backend check karo."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const money = (amount = 0) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(amount);

    return (
        <div className="admin-layout">
            <AdminSidebar activePage="Dashboard" />

            <div className="admin-main">
                <AdminNavbar />

                <main className="dashboard-content">
                    <h1>Admin Dashboard</h1>
                    <p>Electrical Shop Management System</p>

                    {loading && <p>Loading dashboard...</p>}
                    {error && <p role="alert">{error}</p>}

                    {dashboard && !loading && (
                        <>
                            <section className="stats-grid">
                                <article className="stat-card">
                                    <p>Total Sales</p>
                                    <h2>{money(dashboard.totalSales)}</h2>
                                </article>

                                <article className="stat-card">
                                    <p>Amount Collected</p>
                                    <h2>{money(dashboard.totalCollected)}</h2>
                                </article>

                                <article className="stat-card">
                                    <p>Pending Payments</p>
                                    <h2>{money(dashboard.pendingPayments)}</h2>
                                </article>

                                <article className="stat-card">
                                    <p>Today's Sales</p>
                                    <h2>{money(dashboard.todaySales)}</h2>
                                </article>
                            </section>

                            <section className="dashboard-panel">
                                <h2>Sales Summary</h2>
                                <p>Total Bills: {dashboard.totalSalesCount ?? 0}</p>
                                <p>Today's Bills: {dashboard.todaySalesCount ?? 0}</p>
                                <p>
                                    Collected Today: {money(dashboard.todayCollected)}
                                </p>
                            </section>

                            <section className="dashboard-panel">
                                <h2>Low Stock Products</h2>

                                {dashboard.lowStockProducts?.length ? (
                                    dashboard.lowStockProducts.map((product) => (
                                        <div className="stock-row" key={product._id}>
                                            <span>{product.name}</span>
                                            <span>{product.sku}</span>
                                            <strong>Stock: {product.stock}</strong>
                                        </div>
                                    ))
                                ) : (
                                    <p>No low-stock products found.</p>
                                )}
                            </section>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
