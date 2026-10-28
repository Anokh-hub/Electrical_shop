
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        setupKey: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(
                "/auth/register",
                {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                },
                {
                    headers: {
                        "x-owner-setup-key": form.setupKey.trim(),
                    },
                }
            );

            if (!response.data.token) {
                setError("Account created, but login token was not received.");
                return;
            }

            localStorage.setItem("token", response.data.token);
            navigate("/admin");
        } catch (err) {
            setError(
                err.response?.data?.message || "Registration failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
            >
                <h1 className="text-center text-3xl font-bold text-slate-800">
                    Electrical Shop
                </h1>

                <p className="mb-7 mt-2 text-center text-slate-500">
                    Create your owner account
                </p>

                {error && (
                    <p
                        role="alert"
                        className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                    >
                        {error}
                    </p>
                )}

                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium">
                        Full Name
                    </label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your name"
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium">
                        Email Address
                    </label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium">
                        Password
                    </label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                        placeholder="Minimum 8 characters"
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="mb-1 block text-sm font-medium">
                        Owner Setup Key
                    </label>
                    <input
                        name="setupKey"
                        type="password"
                        value={form.setupKey}
                        onChange={handleChange}
                        required
                        placeholder="Enter setup key"
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading ? "Creating Account..." : "Create Account"}
                </button>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
