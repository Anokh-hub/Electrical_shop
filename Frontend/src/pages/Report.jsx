
import { useState } from "react";
import api from "../services/api";

export default function Reports() {
    const [report, setReport] = useState({
        sales: null,
        purchases: null,
        inventory: null,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadReports = async () => {
        try {
            setLoading(true);
            setError("");

            const [salesRes, purchasesRes, inventoryRes] =
                await Promise.all([
                    api.get("/sales"),
                    api.get("/purchases"),
                    api.get("/products"),
                ]);

            const getArray = (data) =>
                Array.isArray(data)
                    ? data
                    : data.sales ||
                    data.purchases ||
                    data.products ||
                    data.data ||
                    [];

            setReport({
                sales: getArray(salesRes.data),
                purchases: getArray(purchasesRes.data),
                inventory: getArray(inventoryRes.data),
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Reports load nahi ho paaye. API routes check karein."
            );
        } finally {
            setLoading(false);
        }
    };

    const totalAmount = (items) =>
        items.reduce(
            (sum, item) =>
                sum + Number(
                    item.totalAmount ??
                    item.total ??
                    item.amount ??
                    0
                ),
            0
        );

    const totalStock = (items) =>
        items.reduce(
            (sum, item) => sum + Number(item.stock ?? item.quantity ?? 0),
            0
        );

    const cards = [
        {
            title: "Total Sales",
            value: report.sales
                ? `₹${totalAmount(report.sales).toLocaleString("en-IN")}`
                : "—",
            detail: report.sales
                ? `${report.sales.length} sales records`
                : "Load report to view",
        },
        {
            title: "Total Purchases",
            value: report.purchases
                ? `₹${totalAmount(report.purchases).toLocaleString("en-IN")}`
                : "—",
            detail: report.purchases
                ? `${report.purchases.length} purchase records`
                : "Load report to view",
        },
        {
            title: "Products",
            value: report.inventory
                ? report.inventory.length
                : "—",
            detail: "Products in inventory",
        },
        {
            title: "Total Stock Units",
            value: report.inventory
                ? totalStock(report.inventory).toLocaleString("en-IN")
                : "—",
            detail: "Units currently recorded",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Reports
                        </h1>
                        <p className="mt-1 text-gray-500">
                            Overview of your electrical shop
                        </p>
                    </div>

                    <button
                        onClick={loadReports}
                        disabled={loading}
                        className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? "Loading..." : "Generate Report"}
                    </button>
                </div>

                {error && (
                    <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            className="rounded-xl bg-white p-6 shadow-sm"
                        >
                            <p className="text-sm font-medium text-gray-500">
                                {card.title}
                            </p>
                            <h2 className="mt-3 text-2xl font-bold text-gray-800">
                                {card.value}
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                {card.detail}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Report Summary
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                        Generate a report to view sales, purchases and
                        inventory totals. These figures depend on the data
                        returned by your backend APIs.
                    </p>
                </div>
            </div>
        </div>
    );
}