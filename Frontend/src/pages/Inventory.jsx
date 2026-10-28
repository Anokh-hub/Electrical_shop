import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Inventory() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [editingProduct, setEditingProduct] = useState(null);
    const [saving, setSaving] = useState(false);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/products");
            setProducts(response.data.products || []);
        } catch (err) {
            setError(
                err.response?.data?.message || "Products load nahi ho paye."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const currency = (price) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(Number(price) || 0);

    const filteredProducts = products.filter((product) =>
        `${product.name || ""} ${product.sku || ""} ${product.category || ""}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const lowStockCount = products.filter(
        (p) => Number(p.stock || 0) <= Number(p.lowStockThreshold ?? 5)
    ).length;

    const openEdit = (product) => {
        setActionError("");
        setEditingProduct({
            _id: product._id,
            name: product.name || "",
            sku: product.sku || "",
            category: product.category || "",
            purchasePrice: product.purchasePrice ?? 0,
            sellingPrice: product.sellingPrice ?? 0,
            stock: product.stock ?? 0,
            lowStockThreshold: product.lowStockThreshold ?? 5,
        });
    };

    const handleEditChange = (e) => {
        setEditingProduct((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setActionError("");

        try {
            const payload = {
                name: editingProduct.name.trim(),
                sku: editingProduct.sku.trim(),
                category: editingProduct.category.trim(),
                purchasePrice: Number(editingProduct.purchasePrice),
                sellingPrice: Number(editingProduct.sellingPrice),
                stock: Number(editingProduct.stock),
                lowStockThreshold: Number(editingProduct.lowStockThreshold),
            };

            if (
                !payload.name ||
                !payload.sku ||
                !payload.category ||
                !Number.isFinite(payload.purchasePrice) ||
                !Number.isFinite(payload.sellingPrice) ||
                !Number.isFinite(payload.stock) ||
                !Number.isFinite(payload.lowStockThreshold) ||
                payload.purchasePrice < 0 ||
                payload.sellingPrice < 0 ||
                payload.stock < 0 ||
                payload.lowStockThreshold < 0 ||
                !Number.isInteger(payload.stock) ||
                !Number.isInteger(payload.lowStockThreshold)
            ) {
                setActionError("Please enter valid product details.");
                return;
            }

            await api.put(`/products/${editingProduct._id}`, payload);
            setEditingProduct(null);
            await fetchProducts();
        } catch (err) {
            setActionError(
                err.response?.data?.message || "Product update nahi hua."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (product) => {
        const confirmed = window.confirm(
            `Kya tum "${product.name}" ko delete karna chahte ho?`
        );

        if (!confirmed) return;

        setActionError("");

        try {
            await api.delete(`/products/${product._id}`);
            await fetchProducts();
        } catch (err) {
            setActionError(
                err.response?.data?.message || "Product delete nahi hua."
            );
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Inventory
                        </h1>
                        <p className="mt-2 text-gray-500">
                            Manage products, prices and available stock.
                        </p>
                    </div>

                    <Link
                        to="/add-product"
                        className="rounded-lg bg-blue-700 px-5 py-3 text-center font-semibold text-white hover:bg-blue-800"
                    >
                        + Add Product
                    </Link>
                </div>

                <section className="mb-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Total Products</p>
                        <h2 className="mt-2 text-3xl font-bold text-gray-900">
                            {products.length}
                        </h2>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Low Stock Products</p>
                        <h2 className="mt-2 text-3xl font-bold text-orange-600">
                            {lowStockCount}
                        </h2>
                    </div>
                </section>

                {actionError && (
                    <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
                        {actionError}
                    </p>
                )}

                <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="border-b border-gray-100 p-5">
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, SKU or category..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {loading ? (
                        <p className="p-6 text-gray-500">Loading products...</p>
                    ) : error ? (
                        <div className="p-6">
                            <p role="alert" className="mb-3 text-red-600">{error}</p>
                            <button
                                onClick={fetchProducts}
                                className="rounded-lg bg-blue-700 px-4 py-2 text-white"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="px-5 py-4">Product</th>
                                        <th className="px-5 py-4">SKU</th>
                                        <th className="px-5 py-4">Category</th>
                                        <th className="px-5 py-4">Purchase Price</th>
                                        <th className="px-5 py-4">Selling Price</th>
                                        <th className="px-5 py-4">Stock</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {filteredProducts.map((product) => {
                                        const stock = Number(product.stock ?? 0);
                                        const threshold = Number(
                                            product.lowStockThreshold ?? 5
                                        );

                                        return (
                                            <tr key={product._id} className="hover:bg-gray-50">
                                                <td className="px-5 py-4 font-medium text-gray-900">
                                                    {product.name}
                                                </td>
                                                <td className="px-5 py-4 text-gray-500">
                                                    {product.sku || "-"}
                                                </td>
                                                <td className="px-5 py-4">
                                                    {product.category || "-"}
                                                </td>
                                                <td className="px-5 py-4">
                                                    {currency(product.purchasePrice)}
                                                </td>
                                                <td className="px-5 py-4">
                                                    {currency(product.sellingPrice)}
                                                </td>
                                                <td className="px-5 py-4">{stock}</td>
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${stock === 0
                                                                ? "bg-red-100 text-red-700"
                                                                : stock <= threshold
                                                                    ? "bg-orange-100 text-orange-700"
                                                                    : "bg-green-100 text-green-700"
                                                            }`}
                                                    >
                                                        {stock === 0
                                                            ? "Out of Stock"
                                                            : stock <= threshold
                                                                ? "Low Stock"
                                                                : "In Stock"}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => openEdit(product)}
                                                            className="rounded-md bg-blue-100 px-3 py-2 font-medium text-blue-700 hover:bg-blue-200"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product)}
                                                            className="rounded-md bg-red-100 px-3 py-2 font-medium text-red-700 hover:bg-red-200"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="px-5 py-10 text-center text-gray-500">
                                                No matching products found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {editingProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                        <form
                            onSubmit={handleUpdate}
                            className="my-6 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
                        >
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Edit Product
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    className="text-2xl text-gray-500 hover:text-gray-900"
                                    aria-label="Close edit form"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    ["name", "Product Name", "text"],
                                    ["sku", "SKU", "text"],
                                    ["category", "Category", "text"],
                                    ["purchasePrice", "Purchase Price", "number"],
                                    ["sellingPrice", "Selling Price", "number"],
                                    ["stock", "Stock Quantity", "number"],
                                    ["lowStockThreshold", "Low Stock Threshold", "number"],
                                ].map(([name, label, type]) => (
                                    <label key={name} className="text-sm font-medium text-gray-700">
                                        {label}
                                        <input
                                            name={name}
                                            type={type}
                                            min={type === "number" ? 0 : undefined}
                                            step={
                                                name === "stock" ||
                                                    name === "lowStockThreshold"
                                                    ? 1
                                                    : type === "number"
                                                        ? "0.01"
                                                        : undefined
                                            }
                                            required
                                            value={editingProduct[name]}
                                            onChange={handleEditChange}
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </label>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}