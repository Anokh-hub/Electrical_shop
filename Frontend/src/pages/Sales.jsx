
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

export default function Sales() {
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [items, setItems] = useState([
        { product: "", quantity: 1 },
    ]);

    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [amountPaid, setAmountPaid] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadData = async () => {
        try {
            const [productResponse, salesResponse] = await Promise.all([
                api.get("/products"),
                api.get("/sales"),
            ]);

            setProducts(productResponse.data.products || []);
            setSales(salesResponse.data.sales || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Data load nahi hua. Login aur backend check karo."
            );
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const billItems = useMemo(() => {
        return items.map((item) => {
            const product = products.find(
                (p) => p._id === item.product
            );

            const quantity = Math.max(0, Number(item.quantity) || 0);
            const unitPrice = Number(product?.sellingPrice) || 0;

            return {
                ...item,
                productData: product,
                quantity,
                unitPrice,
                subtotal: quantity * unitPrice,
            };
        });
    }, [items, products]);

    const totalAmount = billItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
    );

    const updateItem = (index, field, value) => {
        setItems((current) =>
            current.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const addItem = () => {
        setItems((current) => [
            ...current,
            { product: "", quantity: 1 },
        ]);
    };

    const removeItem = (index) => {
        setItems((current) =>
            current.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (billItems.some((item) => !item.productData)) {
            setError("Har row mein product select karo.");
            return;
        }

        if (
            billItems.some(
                (item) =>
                    !Number.isInteger(item.quantity) ||
                    item.quantity < 1 ||
                    item.quantity > item.productData.stock
            )
        ) {
            setError("Quantity valid honi chahiye aur available stock se zyada nahi honi chahiye.");
            return;
        }

        const paid = Number(amountPaid);

        if (
            amountPaid === "" ||
            !Number.isFinite(paid) ||
            paid < 0 ||
            paid > totalAmount
        ) {
            setError("Amount paid total bill ke beech valid value honi chahiye.");
            return;
        }

        setLoading(true);

        try {
            await api.post("/sales", {
                customerName: customerName.trim(),
                customerPhone: customerPhone.trim(),
                items: billItems.map((item) => ({
                    product: item.product,
                    quantity: item.quantity,
                })),
                amountPaid: paid,
                paymentMethod,
                notes: notes.trim(),
            });

            setMessage("Sale successfully created!");
            setCustomerName("");
            setCustomerPhone("");
            setAmountPaid("");
            setPaymentMethod("cash");
            setNotes("");
            setItems([{ product: "", quantity: 1 }]);

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Sale create nahi hui. Backend response check karo."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(amount || 0);

    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Sales & Billing
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Create bills and manage shop sales.
                    </p>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Total Bills Loaded</p>
                        <h2 className="mt-2 text-2xl font-bold text-slate-800">
                            {sales.length}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Sales Value Loaded</p>
                        <h2 className="mt-2 text-2xl font-bold text-blue-600">
                            {formatCurrency(
                                sales.reduce(
                                    (sum, sale) =>
                                        sum + (Number(sale.totalAmount) || 0),
                                    0
                                )
                            )}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Products Available</p>
                        <h2 className="mt-2 text-2xl font-bold text-emerald-600">
                            {products.length}
                        </h2>
                    </div>
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

                <form
                    onSubmit={handleSubmit}
                    className="mb-8 rounded-2xl bg-white p-5 shadow-sm sm:p-7"
                >
                    <h2 className="mb-6 text-xl font-bold text-slate-800">
                        Create New Bill
                    </h2>

                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Customer Name
                            </label>
                            <input
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Walk-in customer"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Customer Phone
                            </label>
                            <input
                                type="tel"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                placeholder="Phone number"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <h3 className="mb-3 font-semibold text-slate-700">
                        Bill Items
                    </h3>

                    <div className="space-y-4">
                        {billItems.map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-1 items-end gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-2 lg:grid-cols-5"
                            >
                                <div className="sm:col-span-2 lg:col-span-2">
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
                                                disabled={product.stock < 1}
                                            >
                                                {product.name} — Stock: {product.stock}
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
                                        max={item.productData?.stock || 1}
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateItem(index, "quantity", e.target.value)
                                        }
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-3 py-3"
                                    />
                                </div>

                                <div>
                                    <p className="mb-2 text-sm font-medium">Unit Price</p>
                                    <p className="py-3 font-semibold">
                                        {formatCurrency(item.unitPrice)}
                                    </p>
                                </div>

                                <div>
                                    <p className="mb-2 text-sm font-medium">Subtotal</p>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="py-3 font-bold text-blue-600">
                                            {formatCurrency(item.subtotal)}
                                        </p>
                                        {items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="rounded-lg px-2 py-2 text-sm text-red-600 hover:bg-red-50"
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
                                Payment Method
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3"
                            >
                                <option value="cash">Cash</option>
                                <option value="upi">UPI</option>
                                <option value="other">Other</option>
                            </select>

                            <label className="mb-2 mt-4 block text-sm font-medium">
                                Notes
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                placeholder="Optional notes"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3"
                            />
                        </div>

                        <div className="rounded-xl bg-slate-50 p-5">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total Amount</span>
                                <span>{formatCurrency(totalAmount)}</span>
                            </div>

                            <label className="mb-2 mt-5 block text-sm font-medium">
                                Amount Paid (₹)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max={totalAmount}
                                step="0.01"
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3"
                                placeholder="Enter amount received"
                            />

                            <div className="mt-4 flex justify-between text-sm">
                                <span className="text-slate-500">Balance Due</span>
                                <span className="font-semibold text-red-600">
                                    {formatCurrency(
                                        Math.max(0, totalAmount - (Number(amountPaid) || 0))
                                    )}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || products.length === 0}
                                className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                {loading ? "Creating Bill..." : "Create Bill"}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-5">
                        <h2 className="text-xl font-bold text-slate-800">
                            Recent Sales
                        </h2>
                    </div>

                    {sales.length === 0 ? (
                        <p className="p-6 text-slate-500">
                            No sales found yet.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="p-4">Bill Number</th>
                                        <th className="p-4">Customer</th>
                                        <th className="p-4">Total</th>
                                        <th className="p-4">Paid</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.map((sale) => (
                                        <tr
                                            key={sale._id}
                                            className="border-t border-slate-100"
                                        >
                                            <td className="p-4 font-medium">
                                                {sale.billNumber || "—"}
                                            </td>
                                            <td className="p-4">
                                                {sale.customerName || "Walk-in"}
                                            </td>
                                            <td className="p-4">
                                                {formatCurrency(sale.totalAmount)}
                                            </td>
                                            <td className="p-4">
                                                {formatCurrency(sale.amountPaid)}
                                            </td>
                                            <td className="p-4">
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize">
                                                    {sale.paymentStatus || "unknown"}
                                                </span>
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
