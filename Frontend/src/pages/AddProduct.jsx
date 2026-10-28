
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const initialForm = {
    name: "",
    sku: "",
    category: "",
    purchasePrice: "",
    sellingPrice: "",
    stock: "",
    lowStockThreshold: "5",
};

export default function AddProduct() {
    const [form, setForm] = useState(initialForm);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const payload = {
                name: form.name.trim(),
                sku: form.sku.trim(),
                category: form.category.trim(),
                purchasePrice: Number(form.purchasePrice),
                sellingPrice: Number(form.sellingPrice),
                stock: Number(form.stock),
                lowStockThreshold: Number(form.lowStockThreshold),
            };

            const response = await api.post("/products", payload);

            setMessage(
                response.data?.message || "Product successfully add ho gaya!"
            );
            setForm(initialForm);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Product add nahi hua. Backend aur validation check karo."
            );
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-3xl">
                <button
                    type="button"
                    onClick={() => navigate("/inventory")}
                    className="mb-6 font-medium text-blue-700 hover:text-blue-900"
                >
                    ← Back to Inventory
                </button>

                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Add New Product
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Electrical shop inventory mein product add karo.
                    </p>

                    {message && (
                        <p className="mt-5 rounded-lg bg-green-50 p-3 text-green-700">
                            {message}
                        </p>
                    )}

                    {error && (
                        <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-red-700">
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                Product Name *
                            </label>
                            <input
                                className={inputClass}
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. LED Bulb 9W"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                SKU / Product Code *
                            </label>
                            <input
                                className={inputClass}
                                name="sku"
                                value={form.sku}
                                onChange={handleChange}
                                placeholder="e.g. LED-009"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                Category *
                            </label>
                            <select
                                className={inputClass}
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select category</option>
                                <option value="Lighting">Lighting</option>
                                <option value="Switches">Switches</option>
                                <option value="Wires & Cables">Wires & Cables</option>
                                <option value="Fans">Fans</option>
                                <option value="Electrical Accessories">
                                    Electrical Accessories
                                </option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block font-medium text-gray-700">
                                    Purchase Price (₹) *
                                </label>
                                <input
                                    className={inputClass}
                                    type="number"
                                    name="purchasePrice"
                                    min="0"
                                    step="0.01"
                                    value={form.purchasePrice}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-medium text-gray-700">
                                    Selling Price (₹) *
                                </label>
                                <input
                                    className={inputClass}
                                    type="number"
                                    name="sellingPrice"
                                    min="0"
                                    step="0.01"
                                    value={form.sellingPrice}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-medium text-gray-700">
                                    Initial Stock *
                                </label>
                                <input
                                    className={inputClass}
                                    type="number"
                                    name="stock"
                                    min="0"
                                    step="1"
                                    value={form.stock}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-medium text-gray-700">
                                    Low Stock Alert Threshold *
                                </label>
                                <input
                                    className={inputClass}
                                    type="number"
                                    name="lowStockThreshold"
                                    min="0"
                                    step="1"
                                    value={form.lowStockThreshold}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Adding Product..." : "Add Product"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
