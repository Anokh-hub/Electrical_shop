import { Link } from "react-router-dom";
import { SHOP, waLink } from "../data/siteData";

const LINKS = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
];

const FEATURES = [
    { icon: "⚡", title: "100% Genuine", desc: "Certified brand products" },
    { icon: "🛡️", title: "Guaranteed Safety", desc: "Tested load standards" },
    { icon: "💬", title: "Instant Advice", desc: "WhatsApp & phone support" },
    { icon: "🚚", title: "Fast Delivery", desc: "Local supply in hours" },
];

export default function Footer() {
    return (
        <footer className="relative isolate overflow-hidden border-t border-cyan-500/20 bg-[#060b19] text-slate-300">
            <style>{`
                /* Subtle circuit grid */
                .es-footer-grid {
                    background-image: linear-gradient(rgba(56, 189, 248, 0.07) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(56, 189, 248, 0.07) 1px, transparent 1px);
                    background-size: 40px 40px;
                }

                /* Top animated neon beam */
                .es-beam {
                    background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.8), rgba(59, 130, 246, 0.9), transparent);
                    animation: es-beam-slide 4s ease-in-out infinite alternate;
                }
                @keyframes es-beam-slide {
                    0% { transform: translateX(-40%); }
                    100% { transform: translateX(40%); }
                }

                /* Pulse glow on bolt */
                .es-pulse-bolt {
                    animation: es-bolt-glow 2.5s ease-in-out infinite alternate;
                }
                @keyframes es-bolt-glow {
                    from { filter: drop-shadow(0 0 4px rgba(6, 182, 212, 0.4)); transform: scale(1); }
                    to { filter: drop-shadow(0 0 14px rgba(56, 189, 248, 0.95)); transform: scale(1.08); }
                }
            `}</style>

            {/* Top Glowing Beam */}
            <div className="absolute left-0 right-0 top-0 h-[2px] overflow-hidden">
                <div className="es-beam h-full w-[200%]" />
            </div>

            {/* Ambient Background Glows */}
            <div className="es-footer-grid pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
            <div className="pointer-events-none absolute -left-20 top-1/2 -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px]" aria-hidden="true" />

            {/* 1. Value Props Strip */}
            <div className="border-b border-cyan-500/10 bg-slate-950/40 py-8 backdrop-blur-sm">
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 sm:grid-cols-4">
                    {FEATURES.map((f) => (
                        <div key={f.title} className="flex items-center gap-3.5">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-950/50 text-xl shadow-inner shadow-cyan-500/20">
                                {f.icon}
                            </span>
                            <div>
                                <h4 className="text-sm font-bold text-white">{f.title}</h4>
                                <p className="text-xs text-slate-400">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Main Footer Content */}
            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 md:grid-cols-12">
                {/* Brand & About */}
                <div className="md:col-span-5">
                    <div className="flex items-center gap-3">
                        <span className="es-pulse-bolt flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/50 bg-gradient-to-br from-cyan-500 to-blue-600 text-xl text-slate-950 font-bold shadow-lg shadow-cyan-500/30">
                            ⚡
                        </span>
                        <div>
                            <p className="text-xl font-extrabold tracking-tight text-white">{SHOP.name}</p>
                            <span className="text-xs font-semibold text-cyan-400">Certified Electrical Supplier</span>
                        </div>
                    </div>

                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                        {SHOP.tagline}. Quality home wiring, switches, sockets, DB boxes, lighting & industrial fittings with trusted safety standards.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2.5">
                        <span className="inline-flex items-center rounded-lg border border-cyan-500/20 bg-slate-900/60 px-3 py-1 text-xs font-medium text-cyan-300">
                            ✓ Wholesale & Retail
                        </span>
                        <span className="inline-flex items-center rounded-lg border border-cyan-500/20 bg-slate-900/60 px-3 py-1 text-xs font-medium text-cyan-300">
                            ✓ Instant Estimates
                        </span>
                    </div>
                </div>

                {/* Quick Navigation Links */}
                <div className="md:col-span-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">Quick Navigation</p>
                    <ul className="mt-4 space-y-2.5 text-sm">
                        {LINKS.map((l) => (
                            <li key={l.to}>
                                <Link
                                    to={l.to}
                                    className="group inline-flex items-center gap-2 text-slate-400 transition-colors duration-200 hover:text-cyan-300"
                                >
                                    <span className="text-cyan-500 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
                                        ›
                                    </span>
                                    <span>{l.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact & Hours */}
                <div className="md:col-span-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">Get In Touch</p>
                    <div className="mt-4 space-y-3.5 text-sm">
                        <a
                            href={`tel:${SHOP.phone}`}
                            className="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-slate-900/50 p-3 text-slate-300 transition-all hover:border-cyan-400 hover:bg-slate-900 hover:text-cyan-200"
                        >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-950 text-cyan-300">
                                📞
                            </span>
                            <div>
                                <span className="block text-[11px] text-slate-400">Call Us Anytime</span>
                                <span className="font-semibold text-white">{SHOP.phoneDisplay}</span>
                            </div>
                        </a>

                        <a
                            href={waLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-slate-900/50 p-3 text-slate-300 transition-all hover:border-emerald-400 hover:bg-slate-900 hover:text-emerald-200"
                        >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-950 text-emerald-300">
                                💬
                            </span>
                            <div>
                                <span className="block text-[11px] text-slate-400">WhatsApp Support</span>
                                <span className="font-semibold text-emerald-300">Chat with Experts</span>
                            </div>
                        </a>

                        <div className="flex items-center gap-3 px-2 text-xs text-slate-400">
                            <span>🕘</span>
                            <span>Working Hours: <strong className="text-slate-200">{SHOP.hours}</strong></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Bottom Bar */}
            <div className="border-t border-cyan-500/10 bg-[#040813] py-5">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-xs text-slate-500 sm:flex-row">
                    <p>© {new Date().getFullYear()} {SHOP.name}. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <span className="text-cyan-400/80">⚡ Safe & Reliable Solutions</span>
                        <span>•</span>
                        <a href="#home" className="transition hover:text-cyan-400">Back to Top ↑</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}