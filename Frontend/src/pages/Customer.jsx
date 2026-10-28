
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
    });

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await api.get("/customers");
            const data = res.data;

            setCustomers(
                Array.isArray(data)
                    ? data
                    : data.customers || data.data || []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load customers. Please check your API."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            await api.post("/customers", form);

            setForm({
                name: "",
                phone: "",
                email: "",
                address: "",
            });

            setShowForm(false);
            await fetchCustomers();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to add customer."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if (!confirmed) return;

        try {
            setError("");
            await api.delete(`/customers/${id}`);

            setCustomers((prev) =>
                prev.filter((customer) => customer._id !== id)
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete customer."
            );
        }
    };

    const filteredCustomers = customers.filter((customer) => {
        const query = search.toLowerCase();

        return (
            (customer.name || "").toLowerCase().includes(query) ||
            (customer.phone || "").toLowerCase().includes(query) ||
            (customer.email || "").toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                            Customers
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your electrical shop customers
                        </p>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
                    >
                        {showForm ? "Cancel" : "+ Add Customer"}
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Add Customer Form */}
                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="mb-6 rounded-xl bg-white p-5 shadow-sm sm:p-6"
                    >
                        <h2 className="mb-5 text-lg font-semibold text-gray-800">
                            Add New Customer
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <input
                                type="text"
                                name="name"
                                placeholder="Customer Name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                            />

                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                className="rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email (optional)"
                                value={form.email}
                                onChange={handleChange}
                                className="rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                            />

                            <input
                                type="text"
                                name="address"
                                placeholder="Address (optional)"
                                value={form.address}
                                onChange={handleChange}
                                className="rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="mt-5 rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Save Customer"}
                        </button>
                    </form>
                )}

                {/* Stats */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Total Customers
                        </p>
                        <h2 className="mt-2 text-3xl font-bold text-gray-800">
                            {customers.length}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Search Results
                        </p>
                        <h2 className="mt-2 text-3xl font-bold text-blue-600">
                            {filteredCustomers.length}
                        </h2>
                    </div>
                </div>

                {/* Customer List */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="border-b border-gray-200 p-5">
                        <input
                            type="text"
                            placeholder="Search by name, phone or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {loading ? (
                        <div className="p-10 text-center text-gray-500">
                            Loading customers...
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="p-10 text-center">
                            <p className="font-medium text-gray-700">
                                No customers found
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                Add a customer or try another search.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="px-5 py-4">Name</th>
                                        <th className="px-5 py-4">Phone</th>
                                        <th className="px-5 py-4">Email</th>
                                        <th className="px-5 py-4">Address</th>
                                        <th className="px-5 py-4">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {filteredCustomers.map((customer) => (
                                        <tr
                                            key={customer._id}
                                            className="transition hover:bg-gray-50"
                                        >
                                            <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-800">
                                                {customer.name}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                                                {customer.phone || "-"}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {customer.email || "-"}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {customer.address || "-"}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                <button
                                                    onClick={() =>
                                                        handleDelete(customer._id)
                                                    }
                                                    className="rounded-md bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
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
