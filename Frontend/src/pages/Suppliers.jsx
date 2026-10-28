
import { useState } from "react";
import api from "../services/api";

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
    });

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await api.get("/suppliers");
            const data = res.data;

            setSuppliers(
                Array.isArray(data)
                    ? data
                    : data.suppliers || data.data || []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load suppliers. Check your backend API."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");

            await api.post("/suppliers", form);

            setForm({
                name: "",
                phone: "",
                email: "",
                address: "",
            });

            setShowForm(false);
            await fetchSuppliers();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to add supplier."
            );
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this supplier?")) return;

        try {
            setError("");
            await api.delete(`/suppliers/${id}`);

            setSuppliers((prev) =>
                prev.filter((supplier) => supplier._id !== id)
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete supplier."
            );
        }
    };

    const filteredSuppliers = suppliers.filter((supplier) =>
        [supplier.name, supplier.phone, supplier.email]
            .some((value) =>
                (value || "").toLowerCase().includes(search.toLowerCase())
            )
    );

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Suppliers
                        </h1>
                        <p className="mt-1 text-gray-500">
                            Manage your shop suppliers
                        </p>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                    >
                        {showForm ? "Cancel" : "+ Add Supplier"}
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
                        {error}
                    </div>
                )}

                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="mb-6 rounded-xl bg-white p-6 shadow"
                    >
                        <h2 className="mb-4 text-xl font-semibold">
                            Add New Supplier
                        </h2>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <input
                                name="name"
                                placeholder="Supplier Name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="rounded-lg border p-3"
                            />

                            <input
                                name="phone"
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                className="rounded-lg border p-3"
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email (optional)"
                                value={form.email}
                                onChange={handleChange}
                                className="rounded-lg border p-3"
                            />

                            <input
                                name="address"
                                placeholder="Address (optional)"
                                value={form.address}
                                onChange={handleChange}
                                className="rounded-lg border p-3"
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-5 rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700"
                        >
                            Save Supplier
                        </button>
                    </form>
                )}

                <div className="mb-5 rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Total Suppliers</p>
                    <p className="mt-2 text-3xl font-bold">
                        {suppliers.length}
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="border-b p-4">
                        <input
                            placeholder="Search suppliers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border p-3"
                        />

                        <button
                            onClick={fetchSuppliers}
                            disabled={loading}
                            className="mt-3 rounded-lg bg-gray-800 px-4 py-2 text-white disabled:opacity-50"
                        >
                            {loading ? "Loading..." : "Load Suppliers"}
                        </button>
                    </div>

                    {loading ? (
                        <p className="p-8 text-center">Loading suppliers...</p>
                    ) : filteredSuppliers.length === 0 ? (
                        <p className="p-8 text-center text-gray-500">
                            No suppliers found. Load suppliers or add a new one.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Phone</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Address</th>
                                        <th className="p-4">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {filteredSuppliers.map((supplier) => (
                                        <tr key={supplier._id}>
                                            <td className="p-4 font-medium">
                                                {supplier.name}
                                            </td>
                                            <td className="p-4">
                                                {supplier.phone || "-"}
                                            </td>
                                            <td className="p-4">
                                                {supplier.email || "-"}
                                            </td>
                                            <td className="p-4">
                                                {supplier.address || "-"}
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() =>
                                                        handleDelete(supplier._id)
                                                    }
                                                    className="rounded bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200"
                                                >
                                                    Delete
                                                </button>
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
