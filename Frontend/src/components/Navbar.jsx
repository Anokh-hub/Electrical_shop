import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const PHONE = "tel:+918171558382";

const NAV_LINKS = [
    { id: "home", label: "Home", path: "/" },
    { id: "services", label: "Services", path: "/services" },
    { id: "products", label: "Products", path: "/products" },
    { id: "about", label: "About", path: "/about" },
    { id: "contact", label: "Contact", path: "/contact" },
];

/* ---------- 3D tilt wrapper ---------- */
function Tilt({ children, className = "", max = 12 }) {
    const ref = useRef(null);

    const handleMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(500px) rotateX(${-y * max}deg) rotateY(${x * max}deg) translateZ(6px)`;
    };

    const handleLeave = () => {
        if (ref.current) ref.current.style.transform = "";
    };

    return (
        <span
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className={`es-tilt ${className}`}
        >
            {children}
        </span>
    );
}

/* ---------- 3D flip link (same tab, React Router) ---------- */
function FlipLink({ to, label, active }) {
    return (
        <Link
            to={to}
            data-active={active}
            aria-current={active ? "page" : undefined}
            className="es-flip relative px-3 py-2 text-[15px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1530] rounded-md"
        >
            <span className="es-flip-inner">
                <span className="es-flip-front">{label}</span>
                <span className="es-flip-back" aria-hidden="true">{label}</span>
            </span>
            <span
                className={`absolute bottom-0 left-3 right-3 h-[3px] origin-left rounded-full bg-yellow-400 transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0"
                    }`}
            />
        </Link>
    );
}

/* ---------- Logo: ghoomta hua 3D cube ---------- */
function CubeLogo() {
    return (
        <div className="es-cube-scene shrink-0" aria-hidden="true">
            <div className="es-cube">
                <span className="es-face es-f-front">⚡</span>
                <span className="es-face es-f-back">⚡</span>
                <span className="es-face es-f-right">⚡</span>
                <span className="es-face es-f-left">⚡</span>
                <span className="es-face es-f-top">⚡</span>
                <span className="es-face es-f-bottom">⚡</span>
            </div>
        </div>
    );
}

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Active link ab current route se nikalta hai
    const { pathname } = useLocation();
    const active = NAV_LINKS.find((l) =>
        l.path === "/" ? pathname === "/" : pathname.startsWith(l.path)
    )?.id;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => e.key === "Escape" && setIsOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen]);

    const close = () => setIsOpen(false);

    return (
        <nav
            className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled
                ? "border-white/10 bg-[#0b1530]/85 shadow-lg shadow-black/30 backdrop-blur-md"
                : "border-transparent bg-[#0b1530] shadow-md shadow-black/20"
                }`}
        >
            <style>{`
                /* ===== Logo cube ===== */
                .es-cube-scene { --s: 40px; width: var(--s); height: var(--s); perspective: 260px; filter: drop-shadow(0 0 8px rgba(250, 204, 21, .45)); }
                .es-cube {
                    position: relative; width: 100%; height: 100%;
                    transform-style: preserve-3d;
                    animation: es-spin 9s linear infinite;
                }
                @keyframes es-spin {
                    from { transform: rotateX(-24deg) rotateY(0deg); }
                    to   { transform: rotateX(-24deg) rotateY(360deg); }
                }
                .es-face {
                    position: absolute; inset: 0; display: grid; place-items: center;
                    font-size: 18px; color: #facc15;
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    border: 1px solid rgba(250, 204, 21, .85);
                    border-radius: 6px;
                    box-shadow: inset 0 0 12px rgba(250, 204, 21, .25);
                }
                .es-f-front  { transform: translateZ(calc(var(--s) / 2)); }
                .es-f-back   { transform: rotateY(180deg) translateZ(calc(var(--s) / 2)); }
                .es-f-right  { transform: rotateY(90deg)  translateZ(calc(var(--s) / 2)); }
                .es-f-left   { transform: rotateY(-90deg) translateZ(calc(var(--s) / 2)); }
                .es-f-top    { transform: rotateX(90deg)  translateZ(calc(var(--s) / 2)); }
                .es-f-bottom { transform: rotateX(-90deg) translateZ(calc(var(--s) / 2)); }

                /* ===== Flip links ===== */
                .es-flip { display: inline-block; perspective: 300px; }
                .es-flip-inner {
                    display: block; position: relative; height: 1.5rem; line-height: 1.5rem;
                    transform-style: preserve-3d;
                    transition: transform .45s cubic-bezier(.3, .7, .3, 1);
                }
                .es-flip:hover .es-flip-inner,
                .es-flip:focus-visible .es-flip-inner { transform: rotateX(-90deg); }
                .es-flip-front, .es-flip-back { display: block; backface-visibility: hidden; }
                .es-flip-front { transform: translateZ(.75rem); color: #e2e8f0; }
                .es-flip-back  {
                    position: absolute; inset: 0; color: #facc15; font-weight: 700;
                    transform: rotateX(90deg) translateZ(.75rem);
                }
                .es-flip[data-active="true"] .es-flip-front { color: #facc15; font-weight: 600; }

                /* ===== Tilt buttons ===== */
                .es-tilt { display: inline-block; transition: transform .2s ease-out; will-change: transform; }

                /* ===== Extruded 3D call button ===== */
                .es-call {
                    box-shadow: 0 4px 0 #b45309, 0 12px 22px rgba(250, 204, 21, .25);
                    transition: box-shadow .15s, transform .15s, background-color .2s;
                }
                .es-call:hover { background-color: #fde047; }
                .es-call:active { transform: translateY(3px); box-shadow: 0 1px 0 #b45309, 0 4px 8px rgba(250, 204, 21, .2); }
                .es-phone { display: inline-block; transform-origin: 50% 60%; animation: es-ring 3s ease-in-out infinite; }
                @keyframes es-ring {
                    0%, 70%, 100% { transform: rotate(0); }
                    74% { transform: rotate(-18deg); } 78% { transform: rotate(16deg); }
                    82% { transform: rotate(-14deg); } 86% { transform: rotate(10deg); }
                    90% { transform: rotate(-4deg); }
                }

                /* ===== Mobile menu: upar se 3D unfold ===== */
                .es-menu-wrap { perspective: 900px; }
                .es-menu { transform-origin: top center; animation: es-unfold .45s cubic-bezier(.2, .8, .2, 1) both; }
                @keyframes es-unfold {
                    from { opacity: 0; transform: rotateX(-75deg); }
                    to   { opacity: 1; transform: none; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .es-cube { animation: none; transform: rotateX(-24deg) rotateY(35deg); }
                    .es-menu, .es-phone { animation: none; }
                    .es-flip-inner, .es-tilt, .es-call { transition: none; }
                }
            `}</style>

            <div
                className={`mx-auto max-w-7xl px-6 transition-all duration-300 ${scrolled ? "py-2.5" : "py-4"
                    }`}
            >
                <div className="flex items-center justify-between">
                    {/* Logo (Home Page Link) */}
                    <Link
                        to="/"
                        className="group flex shrink-0 items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1530]"
                    >
                        <CubeLogo />
                        <span>
                            <span className="block text-xl font-extrabold leading-tight tracking-tight text-white md:text-2xl">
                                Electrical Shop
                            </span>
                            <span
                                className={`block overflow-hidden text-xs text-blue-200/70 transition-all duration-300 ${scrolled ? "max-h-0 opacity-0" : "max-h-5 opacity-100"
                                    }`}
                            >
                                Quality Electrical Solutions
                            </span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden items-center gap-2 md:flex">
                        {NAV_LINKS.map((l) => (
                            <FlipLink
                                key={l.id}
                                to={l.path}
                                label={l.label}
                                active={active === l.id}
                            />
                        ))}

                        <div className="ml-4 flex items-center gap-4">
                            <Tilt>
                                <Link
                                    to="/login"
                                    className="block rounded-lg border-2 border-yellow-400 px-4 py-2 font-semibold text-yellow-400 transition hover:bg-yellow-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1530]"
                                >
                                    Admin Login
                                </Link>
                            </Tilt>

                            <Tilt>
                                <a
                                    href={PHONE}
                                    className="es-call flex items-center gap-2 rounded-lg bg-yellow-400 px-5 py-2.5 font-semibold text-[#0b1530] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1530]"
                                >
                                    <span className="es-phone" aria-hidden="true">📞</span>
                                    Call Now
                                </a>
                            </Tilt>
                        </div>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                        className="relative flex h-11 w-11 items-center justify-center rounded-lg text-white outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-yellow-400 md:hidden"
                    >
                        <span
                            className={`absolute h-0.5 w-6 rounded bg-current transition-transform duration-300 ${isOpen ? "rotate-45" : "-translate-y-2"
                                }`}
                        />
                        <span
                            className={`absolute h-0.5 w-6 rounded bg-current transition-opacity duration-200 ${isOpen ? "opacity-0" : "opacity-100"
                                }`}
                        />
                        <span
                            className={`absolute h-0.5 w-6 rounded bg-current transition-transform duration-300 ${isOpen ? "-rotate-45" : "translate-y-2"
                                }`}
                        />
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {isOpen && (
                    <div className="es-menu-wrap md:hidden">
                        <div className="es-menu mt-4 flex flex-col gap-1 border-t border-white/10 pt-4 pb-3">
                            {NAV_LINKS.map((l) => (
                                <Link
                                    key={l.id}
                                    to={l.path}
                                    onClick={close}
                                    className={`flex items-center justify-between rounded-lg px-4 py-3 font-medium transition ${active === l.id
                                        ? "bg-white/10 text-yellow-400"
                                        : "text-slate-200 hover:bg-white/5 hover:text-yellow-400"
                                        }`}
                                >
                                    {l.label}
                                </Link>
                            ))}

                            <div className="mt-3 flex flex-col gap-3">
                                <Link
                                    to="/login"
                                    onClick={close}
                                    className="rounded-lg border-2 border-yellow-400 px-5 py-2.5 text-center font-semibold text-yellow-400 transition hover:bg-yellow-400/10"
                                >
                                    Admin Login
                                </Link>

                                <a
                                    href={PHONE}
                                    className="es-call flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-5 py-2.5 text-center font-semibold text-[#0b1530]"
                                >
                                    <span className="es-phone" aria-hidden="true">📞</span>
                                    Call Now
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;