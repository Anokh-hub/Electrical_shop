
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    ShoppingBag,
    Users,
    Truck,
    BarChart3,
} from "lucide-react";

export default function AdminSidebar() {
    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: LayoutDashboard,
            end: true,
        },
        {
            name: "Inventory",
            path: "/inventory",
            icon: Package,
        },
        {
            name: "Sales & Billing",
            path: "/sales",
            icon: ShoppingCart,
        },
        {
            name: "Purchases",
            path: "/purchases",
            icon: ShoppingBag,
        },
        {
            name: "Customers",
            path: "/customers",
            icon: Users,
        },
        {
            name: "Suppliers",
            path: "/suppliers",
            icon: Truck,
        },
        {
            name: "Reports",
            path: "/reports",
            icon: BarChart3,
        },
    ];

    return (
        <aside className="flex min-h-screen w-64 shrink-0 flex-col bg-slate-950 px-4 py-6 text-white">
            {/* Logo */}
            <div className="mb-10 px-3">
                <h2 className="text-2xl font-bold tracking-tight">
                    Electrical<span className="text-blue-400">Shop</span>
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                    Management System
                </p>
            </div>

            {/* Menu heading */}
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                Main Menu
            </p>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col gap-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-950/40"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`
                            }
                        >
                            <Icon size={20} strokeWidth={1.8} />
                            <span>{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-sm font-semibold text-white">
                    Admin Panel
                </p>
                <p className="mt-1 text-xs text-slate-400">
                    Manage your electrical shop
                </p>
            </div>
        </aside>
    );
}
