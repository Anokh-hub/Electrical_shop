
import { useEffect, useState } from "react";
import api from "../services/api";

const emptyItem = {
    product: "",
    quantity: 1,
    purchasePrice: "",
};

export default function Purchases() {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [purchases, setPurchases] = useState([]);

    const [form, setForm] = useState({
        invoiceNumber: "",
        supplier: "",
        amountPaid: "0",
        notes: "",
    });

    const [items, setItems] = useState([{ ...emptyItem }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const currency = (value) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(Number(value) || 0);

    const loadData = async () => {
        try {
            setError("");

            const [productRes, supplierRes, purchaseRes] =
                await Promise.all([
                    api.get("/products"),
                    api.get("/suppliers"),
                    api.get("/purchases"),
                ]);

            setProducts(productRes.data.products || []);
            setSuppliers(supplierRes.data.suppliers || []);
            setPurchases(purchaseRes.data.purchases || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Purchases data load nahi hua. API routes check karo."
            );
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const updateItem = (index, field, value) => {
        setItems((current) =>
            current.map((item, i) => {
                if (i !== index) return item;

                const updated = { ...item, [field]: value };

                if (field === "product") {
                    const selected = products.find(
                        (p) => p._id === value
                    );

                    updated.purchasePrice =
                        selected?.purchasePrice ?? "";
                }

                return updated;
            })
        );
    };

    const addItem = () => {
        setItems((current) => [
            ...current,
            { ...emptyItem },
        ]);
    };

    const removeItem = (index) => {
        setItems((current) =>
            current.filter((_, i) => i !== index)
        );
    };

    const totalAmount = items.reduce((sum, item) => {
        return (
            sum +
            (Number(item.quantity) || 0) *
            (Number(item.purchasePrice) || 0)
        );
    }, 0);

    const amountPaid = Number(form.amountPaid) || 0;
    const balance = totalAmount - amountPaid;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!form.supplier) {
            setError("Please select a supplier.");
            return;
        }

        if (!items.length || items.some(
            (item) =>
                !item.product ||
                !Number.isInteger(Number(item.quantity)) ||
                Number(item.quantity) < 1 ||
                item.purchasePrice === "" ||
                !Number.isFinite(Number(item.purchasePrice)) ||
                Number(item.purchasePrice) < 0
        )) {
            setError("Products, valid quantities aur purchase prices enter karo.");
            return;
        }

        if (
            !Number.isFinite(amountPaid) ||
            amountPaid < 0 ||
            amountPaid > totalAmount
        ) {
            setError("Amount paid total purchase amount se zyada nahi ho sakta.");
            return;
        }

        setLoading(true);

        try {
            await api.post("/purchases", {
                invoiceNumber: form.invoiceNumber.trim(),
                supplier: form.supplier,
                items: items.map((item) => ({
                    product: item.product,
                    quantity: Number(item.quantity),
                    purchasePrice: Number(item.purchasePrice),
                })),
                amountPaid,
                notes: form.notes.trim(),
            });

            setMessage("Purchase successfully created!");
            setForm({
                invoiceNumber: "",
                supplier: "",
                amountPaid: "0",
                notes: "",
            });
            setItems([{ ...emptyItem }]);

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Purchase create nahi hui. Backend request check karo."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Purchases
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Record supplier invoices and manage incoming stock.
                    </p>
                </div>

                {error && (
                    <div role="alert" className="mb-5 rounded-lg bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}

                {message && (
                    <div role="status" className="mb-5 rounded-lg bg-green-50 p-4 text-green-700">
                        {message}
                    </div>
                )}

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Purchase Records</p>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {purchases.length}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Total Purchase Value</p>
                        <p className="mt-2 text-2xl font-bold text-blue-600">
                            {currency(
                                purchases.reduce(
                                    (sum, purchase) =>
                                        sum + (Number(purchase.totalAmount) || 0),
                                    0
                                )
                            )}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Suppliers</p>
                        <p className="mt-2 text-2xl font-bold text-emerald-600">
                            {suppliers.length}
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mb-8 rounded-2xl bg-white p-5 shadow-sm sm:p-7"
                >
                    <h2 className="mb-6 text-xl font-bold text-slate-800">
                        Record New Purchase
                    </h2>

                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Invoice Number
                            </label>
                            <input
                                value={form.invoiceNumber}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        invoiceNumber: e.target.value,
                                    })
                                }
                                required
                                placeholder="Supplier invoice number"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Supplier
                            </label>
                            <select
                                value={form.supplier}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        supplier: e.target.value,
                                    })
                                }
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3"
                            >
                                <option value="">Select supplier</option>
                                {suppliers.map((supplier) => (
                                    <option
                                        key={supplier._id}
                                        value={supplier._id}
                                    >
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>

                            {suppliers.length === 0 && (
                                <p className="mt-2 text-sm text-amber-700">
                                    Add a supplier before recording a purchase.
                                </p>
                            )}
                        </div>
                    </div>

                    <h3 className="mb-3 font-semibold text-slate-700">
                        Purchased Products
                    </h3>

                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-2 lg:grid-cols-4"
                            >
                                <div className="lg:col-span-1">
                                    <label className="mb-2 block text-sm font-medium">
                                        Product
                                    </label>
                                    <select
                                        value={item.product}
                                        onChange={(e) =>
                                            updateItem(index, "product", e.target.value)
                                        }
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-3 py-3"
                                    >
                                        <option value="">Select product</option>
                                        {products.map((product) => (
                                            <option
                                                key={product._id}
                                                value={product._id}
                                            >
                                                {product.name} ({product.sku})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateItem(index, "quantity", e.target.value)
                                        }
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-3 py-3"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Purchase Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={item.purchasePrice}
                                        onChange={(e) =>
                                            updateItem(index, "purchasePrice", e.target.value)
                                        }
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-3 py-3"
                                    />
                                </div>

                                <div>
                                    <p className="mb-2 text-sm font-medium">
                                        Subtotal
                                    </p>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="py-3 font-bold text-blue-600">
                                            {currency(
                                                (Number(item.quantity) || 0) *
                                                (Number(item.purchasePrice) || 0)
                                            )}
                                        </p>
                                        {items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="text-sm text-red-600 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addItem}
                        className="mt-4 rounded-lg border border-blue-600 px-4 py-2 font-medium text-blue-600 hover:bg-blue-50"
                    >
                        + Add Product
                    </button>

                    <div className="mt-8 grid grid-cols-1 gap-5 border-t border-slate-200 pt-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Notes
                            </label>
                            <textarea
                                value={form.notes}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        notes: e.target.value,
                                    })
                                }
                                rows={4}
                                placeholder="Optional purchase notes"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3"
                            />
                        </div>

                        <div className="rounded-xl bg-slate-50 p-5">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total Amount</span>
                                <span>{currency(totalAmount)}</span>
                            </div>

                            <label className="mb-2 mt-5 block text-sm font-medium">
                                Amount Paid (₹)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max={totalAmount}
                                step="0.01"
                                value={form.amountPaid}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        amountPaid: e.target.value,
                                    })
                                }
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3"
                            />

                            <div className="mt-4 flex justify-between text-sm">
                                <span className="text-slate-500">Balance Due</span>
                                <span className="font-semibold text-red-600">
                                    {currency(balance)}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || products.length === 0 || suppliers.length === 0}
                                className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                {loading ? "Saving Purchase..." : "Save Purchase"}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-5">
                        <h2 className="text-xl font-bold text-slate-800">
                            Recent Purchases
                        </h2>
                    </div>

                    {purchases.length === 0 ? (
                        <p className="p-6 text-slate-500">
                            No purchase records found.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="p-4">Invoice</th>
                                        <th className="p-4">Supplier</th>
                                        <th className="p-4">Total</th>
                                        <th className="p-4">Paid</th>
                                        <th className="p-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchases.map((purchase) => (
                                        <tr
                                            key={purchase._id}
                                            className="border-t border-slate-100"
                                        >
                                            <td className="p-4 font-medium">
                                                {purchase.invoiceNumber || "—"}
                                            </td>
                                            <td className="p-4">
                                                {purchase.supplier?.name ||
                                                    purchase.supplierName ||
                                                    "—"}
                                            </td>
                                            <td className="p-4">
                                                {currency(purchase.totalAmount)}
                                            </td>
                                            <td className="p-4">
                                                {currency(purchase.amountPaid)}
                                            </td>
                                            <td className="p-4">
                                                {purchase.createdAt
                                                    ? new Date(purchase.createdAt).toLocaleDateString("en-IN")
                                                    : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
