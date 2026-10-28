
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        console.log("Frontend email:", JSON.stringify(form.email));
        console.log("Password length:", form.password.length);

        try {
            const response = await api.post("/auth/login", {
                email: form.email.trim().toLowerCase(),
                password: form.password,
            });
            const data = response.data;
            const token = data.token || data.accessToken;

            if (!token) {
                setError("Login response mein token nahi mila.");
                return;
            }

            localStorage.setItem("token", token);
            navigate("/admin");
        } catch (err) {
            console.log("Request URL:", err.config?.baseURL + err.config?.url);
            console.log("Status:", err.response?.status);
            console.log("Response:", err.response?.data);
            setError(
                err.response?.data?.message ||
                "Login failed. Backend check karo."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Electrical Shop</h1>
                <h2>Admin Login</h2>

                {error && <p role="alert">{error}</p>}

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="mt-5 text-center text-sm text-slate-600">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Create Account
                    </Link>
                </p>
            </form>
        </div>
    );
}
