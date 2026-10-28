import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"; // <-- Navbar import kiya
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { PRODUCT_CATEGORIES, SHOP, waLink } from "../data/siteData";

import product1 from "../assets/images/product1.jpeg";
import cables_wires from "../assets/images/cables_wires.jpeg";
import MCB from "../assets/images/MCB.jpeg";
import switch_sockets from "../assets/images/switch_sockets.jpeg";
import shop from "../assets/images/shop.jpeg";

/* id = data/siteData.js ki category se judta hai (items wahin se aate hain) */
const BASE = [
    {
        id: "wiring", name: "Electrical Wires", image: cables_wires,
        description: "High-quality wires for safe and reliable electrical connections.",
        tip: "Tell us your load and we will suggest the right wire size."
    },
    {
        id: "lighting", name: "LED Lights", image: product1,
        description: "Energy-efficient LED bulbs, panels and lighting solutions.",
        tip: "Share the room size and we will suggest the right brightness."
    },
    {
        id: "switches", name: "Switches & Sockets", image: switch_sockets,
        description: "Durable switches and sockets for homes and offices.",
        tip: "Bring a photo of your old board and we will match the plates."
    },
    {
        id: "protection", name: "MCB & DB Boxes", image: MCB,
        description: "Reliable electrical protection and distribution products.",
        tip: "Not sure about the rating? Tell us your appliances and we will guide you."
    },
    {
        id: "fans", name: "Fans", image: product1,
        description: "Quality ceiling and electrical fans for your home.",
        tip: "Ask us which fan size suits your room."
    },
    {
        id: "tools", name: "Electrical Accessories", image: shop,
        description: "Plugs, holders, connectors and other electrical accessories.",
        tip: "Need a part urgently? Message us the item name."
    },
];

const PRODUCTS = BASE.map((p) => {
    const c = PRODUCT_CATEGORIES.find((x) => x.id === p.id);
    return { ...p, icon: c?.icon || "⚡", items: c?.items || [], category: c?.title || "Product" };
});

const HIGHLIGHTS = [
    "Suitable for homes, shops and offices",
    "Honest advice on the right rating and size",
    "Fair prices, special rates for bulk orders",
];

/* ---------- Naya content ---------- */
const TRUST = [
    { icon: "🛡️", title: "Genuine Products", text: "Trusted brands only" },
    { icon: "💰", title: "Fair Prices", text: "No hidden charges" },
    { icon: "🧑‍🔧", title: "Honest Advice", text: "Right rating, right size" },
    { icon: "📦", title: "Bulk Rates", text: "Special price on large orders" },
];

const POPULAR = ["MCB", "LED", "Switch", "Wire", "Fan"];

const GUIDE = [
    {
        icon: "🔌",
        title: "Choosing a wire",
        text: "The right wire size depends on the load it will carry. Tell us which appliances will run on it and we will suggest the size.",
    },
    {
        icon: "⚡",
        title: "Choosing an MCB",
        text: "The MCB rating should suit the circuit and the connected load. Share what runs on the circuit and we will guide you.",
    },
    {
        icon: "💡",
        title: "Choosing an LED",
        text: "Brightness is measured in lumens, not watts. Tell us the room size and we will recommend a fitting that suits it.",
    },
    {
        icon: "🌀",
        title: "Choosing a fan",
        text: "Fan size depends on how big the room is. Share the room size and we will suggest the right sweep.",
    },
    {
        icon: "✅",
        title: "Check the safety mark",
        text: "Look for the ISI/BIS mark on the box before you buy. Certified products are tested for safety.",
    },
    {
        icon: "🧰",
        title: "Get it fitted safely",
        text: "For wiring and fitting work, always use a qualified electrician and switch off the main supply first.",
    },
];

const STEPS = [
    { icon: "🔍", title: "Browse or search", text: "Find the product category you need on this page." },
    { icon: "💬", title: "Ask price & availability", text: "Message us on WhatsApp or call, and we will confirm today's price." },
    { icon: "🏪", title: "Visit and collect", text: "Come to the shop, check the product and take it home." },
];

const FAQS = [
    {
        q: "Why are prices not shown on this page?",
        a: "Prices change with the brand, model and market rate, so we do not list fixed prices. Message us the item name and we will share today's price and availability.",
    },
    {
        q: "Do you give special rates on bulk orders?",
        a: "Yes, we offer special rates for bulk orders. Message or call us with your requirement and we will quote you.",
    },
    {
        q: "What if I cannot find my product here?",
        a: "We stock much more than what is listed. Message us the item name and we will confirm if we have it.",
    },
    {
        q: "Can I ask about a product on WhatsApp?",
        a: "Yes. Send the product name, or a photo of the item you want to match, and we will reply with details.",
    },
    {
        q: "Are these products suitable for homes and shops?",
        a: "Yes. Our range suits homes, shops and offices. Tell us your use and we will suggest the right product.",
    },
];

/* ================= Card: 3D tilt + glare ================= */
function ProductCard({ p, i, onOpen }) {
    const ref = useRef(null);

    const move = (e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
        el.style.setProperty("--ry", `${(x - 0.5) * 12}deg`);
        el.style.setProperty("--gx", `${x * 100}%`);
        el.style.setProperty("--gy", `${y * 100}%`);
    };

    const leave = () => {
        const el = ref.current;
        if (!el) return;
        el.style.removeProperty("--rx");
        el.style.removeProperty("--ry");
    };

    return (
        <Reveal delay={i * 80} className="h-full">
            <article
                ref={ref}
                onMouseMove={move}
                onMouseLeave={leave}
                className="pr-card group relative flex h-full flex-col rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-slate-900/90 to-slate-950/80 p-4 shadow-xl shadow-cyan-950/20 transition-all duration-300 hover:border-cyan-400 hover:shadow-cyan-500/20"
            >
                <span className="pr-glare" />

                <div className="pr-img relative h-52 overflow-hidden rounded-xl border border-cyan-500/10">
                    <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070d1e]/85 via-transparent to-transparent" />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-cyan-300 ring-1 ring-cyan-400/40 backdrop-blur-md">
                        <span aria-hidden="true">{p.icon}</span> {p.category}
                    </span>
                </div>

                <div className="pr-pop flex flex-1 flex-col px-2 pb-2 pt-5">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">{p.name}</h3>
                    <p className="mt-2 text-slate-300 leading-relaxed text-sm">{p.description}</p>

                    <ul className="mt-4 flex flex-wrap gap-2">
                        {p.items.slice(0, 3).map((it) => (
                            <li key={it} className="rounded-full border border-cyan-500/20 bg-cyan-950/40 px-3 py-1 text-xs text-cyan-200">
                                {it}
                            </li>
                        ))}
                        {p.items.length > 3 && (
                            <li className="rounded-full border border-cyan-400/50 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                                +{p.items.length - 3} more
                            </li>
                        )}
                    </ul>

                    <div className="mt-auto flex items-center gap-3 pt-6">
                        <button
                            type="button"
                            onClick={(e) => onOpen(p, e.currentTarget)}
                            className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 font-bold text-slate-950 shadow-lg shadow-cyan-500/25 outline-none transition-all hover:-translate-y-0.5 hover:shadow-cyan-500/40 active:translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cyan-300"
                        >
                            View Details
                        </button>
                        <a
                            href={waLink(`Hello, I want to know the price and availability of ${p.name}.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Ask about ${p.name} on WhatsApp`}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/40 bg-emerald-950/30 text-lg text-emerald-300 outline-none transition hover:bg-emerald-500 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-emerald-400"
                        >
                            💬
                        </a>
                    </div>
                </div>
            </article>
        </Reveal>
    );
}

/* ================= Details modal ================= */
function Modal({ p, onClose, returnFocus }) {
    const closeRef = useRef(null);
    const boxRef = useRef(null);

    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeRef.current?.focus();

        const onKey = (e) => {
            if (e.key === "Escape") return onClose();
            if (e.key !== "Tab") return;
            const f = boxRef.current?.querySelectorAll("a[href], button:not([disabled])");
            if (!f || !f.length) return;
            const first = f[0];
            const last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
            returnFocus?.focus?.();
        };
    }, [onClose, returnFocus]);

    return (
        <div
            className="pr-backdrop fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                ref={boxRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="pr-modal-title"
                className="pr-modal relative grid max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-cyan-500/30 bg-[#091124] shadow-2xl shadow-cyan-950/60 md:grid-cols-2"
            >
                <button
                    ref={closeRef}
                    type="button"
                    onClick={onClose}
                    aria-label="Close details"
                    className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/90 text-xl text-slate-300 outline-none ring-1 ring-cyan-500/30 transition hover:bg-cyan-400 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                    ✕
                </button>

                <div className="h-60 md:h-auto border-b md:border-b-0 md:border-r border-cyan-500/10">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                </div>

                <div className="p-7 md:p-9 flex flex-col justify-between">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-950/60 px-3 py-1 text-xs font-semibold text-cyan-300 ring-1 ring-cyan-400/40">
                            {p.icon} {p.category}
                        </span>
                        <h3 id="pr-modal-title" className="mt-4 text-3xl font-extrabold text-white">{p.name}</h3>
                        <p className="mt-3 text-slate-300 leading-relaxed">{p.description}</p>

                        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-cyan-400">What we have</p>
                        <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-200 sm:grid-cols-2">
                            {p.items.map((it) => (
                                <li key={it} className="flex items-center gap-2">
                                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-bold text-slate-950 shadow-sm shadow-cyan-400/50">✓</span>
                                    {it}
                                </li>
                            ))}
                        </ul>

                        <ul className="mt-6 space-y-1.5 text-sm text-slate-300">
                            {HIGHLIGHTS.map((h) => (
                                <li key={h} className="flex items-center gap-2">
                                    <span className="text-cyan-400">⚡</span>
                                    <span>{h}</span>
                                </li>
                            ))}
                        </ul>

                        <p className="mt-6 rounded-xl border border-dashed border-cyan-400/40 bg-cyan-950/30 p-4 text-sm text-cyan-100">
                            💡 {p.tip}
                        </p>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3 pt-2">
                        <a
                            href={waLink(`Hello, I want to know the price and availability of ${p.name}.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:shadow-emerald-500/40"
                        >
                            💬 Ask price
                        </a>
                        <a
                            href={`tel:${SHOP.phone}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-slate-900/60 px-5 py-3 font-semibold text-cyan-200 backdrop-blur-sm transition-all hover:border-cyan-400 hover:bg-slate-800"
                        >
                            📞 Call Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ================= Section heading ================= */
function SectionHead({ tag, title, text }) {
    return (
        <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">{tag}</p>
            <h2 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">{title}</h2>
            {text && <p className="mt-3 text-slate-300">{text}</p>}
        </div>
    );
}

/* ================= FAQ item ================= */
function FaqItem({ id, q, a, open, onToggle }) {
    return (
        <div className={`pr-faq rounded-2xl border bg-slate-900/60 ${open ? "is-open border-cyan-400/60 shadow-lg shadow-cyan-950/40" : "border-cyan-500/20"}`}>
            <button
                type="button"
                id={`${id}-btn`}
                aria-expanded={open}
                aria-controls={`${id}-panel`}
                onClick={onToggle}
                className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
                <span className="font-semibold text-white">{q}</span>
                <span className="pr-plus" aria-hidden="true" />
            </button>
            <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} className="pr-faq-panel">
                <div className="overflow-hidden">
                    <p className="px-5 pb-5 leading-relaxed text-slate-300">{a}</p>
                </div>
            </div>
        </div>
    );
}

/* ================= Page ================= */
export default function Products() {
    const [active, setActive] = useState("all");
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);
    const [openFaq, setOpenFaq] = useState(0);
    const triggerRef = useRef(null);

    const open = (p, el) => {
        triggerRef.current = el;
        setSelected(p);
    };
    const close = useCallback(() => setSelected(null), []);

    const q = query.trim().toLowerCase();
    const list = PRODUCTS.filter(
        (p) =>
            (active === "all" || p.id === active) &&
            (!q ||
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.items.some((it) => it.toLowerCase().includes(q)))
    );

    const tabs = [{ id: "all", title: "All" }, ...PRODUCT_CATEGORIES];

    const quickSearch = (term) => {
        setActive("all");
        setQuery(term);
    };

    return (
        <div className="min-h-screen bg-[#070d1e] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
            {/* Top Navigation Bar */}
            <Navbar />

            <style>{`
                .pr-card { transform-style: preserve-3d; transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)); transition: transform .2s ease-out, border-color .3s, box-shadow .3s; }
                .pr-img { transform: translateZ(18px); }
                .pr-pop { transform: translateZ(30px); }
                .pr-glare { position: absolute; inset: 0; border-radius: inherit; opacity: 0; pointer-events: none; transition: opacity .3s; z-index: 1;
                    background: radial-gradient(280px circle at var(--gx, 50%) var(--gy, 50%), rgba(56, 189, 248, .18), transparent 60%); }
                .pr-card:hover .pr-glare { opacity: 1; }
                .pr-backdrop { animation: pr-fade .3s ease both; }
                @keyframes pr-fade { from { opacity: 0; } to { opacity: 1; } }
                .pr-modal { transform-origin: 50% 100%; animation: pr-pop .5s cubic-bezier(.2, .8, .2, 1) both; }
                @keyframes pr-pop { from { opacity: 0; transform: perspective(1000px) rotateX(-22deg) translateY(50px) scale(.95); } to { opacity: 1; transform: none; } }

                /* ===== Naya: tilt sirf hover wale cards par (guide, trust) ===== */
                .pr-lift { transform-style: preserve-3d; transition: transform .35s cubic-bezier(.2, .8, .2, 1), border-color .3s, box-shadow .3s; }
                .pr-lift:hover { transform: perspective(900px) translateY(-6px) rotateX(4deg); border-color: rgba(34, 211, 238, .7); box-shadow: 0 18px 36px rgba(8, 145, 178, .22); }

                /* ===== Steps ===== */
                .pr-steps { position: relative; }
                @media (min-width: 768px) {
                    .pr-steps::before { content: ""; position: absolute; left: 17%; right: 17%; top: 36px; border-top: 2px dashed rgba(34, 211, 238, .4); }
                }
                .pr-badge {
                    position: relative; display: grid; place-items: center; width: 72px; height: 72px; margin: 0 auto; border-radius: 50%; font-size: 30px;
                    background: linear-gradient(135deg, #0e7490, #1d4ed8);
                    border: 2px solid #22d3ee;
                    box-shadow: 0 6px 0 #0c4a6e, 0 16px 26px rgba(0, 0, 0, .4), inset 0 0 14px rgba(34, 211, 238, .25);
                }
                .pr-num {
                    position: absolute; top: -6px; right: -6px; width: 26px; height: 26px; border-radius: 50%;
                    display: grid; place-items: center; font-size: 13px; font-weight: 800; background: #22d3ee; color: #020617;
                }

                /* ===== FAQ ===== */
                .pr-plus { position: relative; width: 18px; height: 18px; flex-shrink: 0; }
                .pr-plus::before, .pr-plus::after {
                    content: ""; position: absolute; left: 0; top: 50%; width: 100%; height: 2px; margin-top: -1px;
                    background: #22d3ee; border-radius: 2px; transition: transform .3s ease;
                }
                .pr-plus::after { transform: rotate(90deg); }
                .pr-faq.is-open .pr-plus::after { transform: rotate(0deg); }
                .pr-faq-panel { display: grid; grid-template-rows: 0fr; visibility: hidden; transition: grid-template-rows .35s ease, visibility .35s; }
                .pr-faq.is-open .pr-faq-panel { grid-template-rows: 1fr; visibility: visible; }

                /* ===== CTA ===== */
                .pr-cta {
                    border-radius: 24px; padding: 40px 28px; text-align: center;
                    background: linear-gradient(135deg, #0e7490, #1d4ed8);
                    border: 1px solid rgba(34, 211, 238, .55);
                    box-shadow: 0 8px 0 rgba(34, 211, 238, .35), 0 26px 44px rgba(0, 0, 0, .45);
                }

                @media (prefers-reduced-motion: reduce) {
                    .pr-card { transform: none; transition: none; }
                    .pr-lift, .pr-lift:hover { transform: none; transition: none; }
                    .pr-backdrop, .pr-modal { animation: none; }
                    .pr-faq-panel, .pr-plus::before, .pr-plus::after { transition: none; }
                }
            `}</style>

            <PageHeader
                icon="🛒"
                title="Our Products"
                text="Quality electrical products for homes, shops and offices. Ask us for today's price and availability."
            />

            <section className="px-6 py-16">
                <div className="mx-auto max-w-7xl">
                    {/* Trust strip */}
                    <div className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {TRUST.map((t, i) => (
                            <Reveal key={t.title} delay={i * 70} className="h-full">
                                <div className="pr-lift flex h-full items-center gap-3 rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-4">
                                    <span className="text-3xl" aria-hidden="true">{t.icon}</span>
                                    <div>
                                        <p className="font-semibold text-white">{t.title}</p>
                                        <p className="text-xs text-slate-400">{t.text}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    {/* Search + filter */}
                    <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter products">
                            {tabs.map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    aria-pressed={active === t.id}
                                    onClick={() => setActive(t.id)}
                                    className={`rounded-full border px-5 py-2 text-sm font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-cyan-400 ${active === t.id
                                            ? "border-cyan-400 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/25"
                                            : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-300"
                                        }`}
                                >
                                    {t.title}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full lg:w-72">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" aria-hidden="true">🔍</span>
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search e.g. MCB, LED, switch"
                                aria-label="Search products"
                                className="w-full rounded-xl border border-cyan-500/20 bg-slate-900/60 py-2.5 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                            />
                        </div>
                    </div>

                    {/* Popular searches */}
                    <div className="mb-8 flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-slate-400">Popular searches:</span>
                        {POPULAR.map((term) => (
                            <button
                                key={term}
                                type="button"
                                onClick={() => quickSearch(term)}
                                className="rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 text-cyan-200 outline-none transition hover:border-cyan-400 hover:bg-cyan-500/10 focus-visible:ring-2 focus-visible:ring-cyan-400"
                            >
                                {term}
                            </button>
                        ))}
                        {(query || active !== "all") && (
                            <button
                                type="button"
                                onClick={() => {
                                    setQuery("");
                                    setActive("all");
                                }}
                                className="ml-1 rounded-full px-3 py-1 text-slate-400 underline-offset-2 outline-none transition hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-cyan-400"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>

                    <p className="mb-6 text-sm text-slate-400" aria-live="polite">
                        Showing <span className="font-semibold text-cyan-300">{list.length}</span> of {PRODUCTS.length} product categories
                    </p>

                    {list.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {list.map((p, i) => (
                                <ProductCard key={p.id} p={p} i={i} onOpen={open} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-cyan-500/30 bg-slate-900/40 p-12 text-center backdrop-blur-sm">
                            <p className="text-5xl">🔎</p>
                            <p className="mt-4 text-lg font-semibold text-white">No matching product found</p>
                            <p className="mt-2 text-slate-400">We may still have it. Message us the item name and we will confirm.</p>
                            <a
                                href={waLink(`Hello, do you have ${query || "this item"}?`)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:shadow-emerald-500/40"
                            >
                                💬 Ask on WhatsApp
                            </a>
                        </div>
                    )}

                    <Reveal className="mt-14">
                        <p className="rounded-2xl border border-dashed border-cyan-400/40 bg-cyan-950/20 p-6 text-center text-slate-300">
                            Can't see what you need? We stock much more than listed here. Message us the item name and we will confirm.
                        </p>
                    </Reveal>

                    {/* ================= Buying guide ================= */}
                    <div className="mt-24">
                        <Reveal>
                            <SectionHead
                                tag="Buying guide"
                                title="Not sure what to buy?"
                                text="A few quick tips to help you choose the right product. When in doubt, just ask us."
                            />
                        </Reveal>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {GUIDE.map((g, i) => (
                                <Reveal key={g.title} delay={i * 70} className="h-full">
                                    <div className="pr-lift h-full rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-slate-900/90 to-slate-950/80 p-6">
                                        <span className="text-3xl" aria-hidden="true">{g.icon}</span>
                                        <h3 className="mt-3 text-lg font-bold text-white">{g.title}</h3>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-300">{g.text}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>

                    {/* ================= How to order ================= */}
                    <div className="mt-24">
                        <Reveal>
                            <SectionHead
                                tag="How to order"
                                title="Three simple steps"
                                text="No complicated process. Ask, confirm and collect."
                            />
                        </Reveal>

                        <Reveal>
                            <div className="pr-steps grid gap-10 md:grid-cols-3">
                                {STEPS.map((s, i) => (
                                    <div key={s.title} className="text-center">
                                        <div className="pr-badge" aria-hidden="true">
                                            {s.icon}
                                            <span className="pr-num">{i + 1}</span>
                                        </div>
                                        <h3 className="mt-5 text-lg font-bold text-white">{s.title}</h3>
                                        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-300">{s.text}</p>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    </div>

                    {/* ================= Bulk order banner ================= */}
                    <Reveal className="mt-24">
                        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-cyan-400/40 bg-gradient-to-r from-cyan-950/60 to-slate-900/60 p-8 md:flex-row">
                            <div className="text-center md:text-left">
                                <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Contractors & bulk buyers</p>
                                <h3 className="mt-2 text-2xl font-extrabold text-white">Need a large quantity?</h3>
                                <p className="mt-2 max-w-xl text-slate-300">
                                    Send us your list and we will share a special bulk rate for your project.
                                </p>
                            </div>
                            <a
                                href={waLink("Hello, I want a quote for a bulk order.")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 outline-none transition-all hover:-translate-y-0.5 hover:shadow-emerald-500/40 focus-visible:ring-2 focus-visible:ring-emerald-300"
                            >
                                💬 Get bulk quote
                            </a>
                        </div>
                    </Reveal>

                    {/* ================= FAQ ================= */}
                    <div className="mx-auto mt-24 max-w-3xl">
                        <Reveal>
                            <SectionHead tag="FAQ" title="Common questions" />
                        </Reveal>

                        <Reveal className="flex flex-col gap-3">
                            {FAQS.map((f, i) => (
                                <FaqItem
                                    key={f.q}
                                    id={`pr-faq-${i}`}
                                    q={f.q}
                                    a={f.a}
                                    open={openFaq === i}
                                    onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                                />
                            ))}
                        </Reveal>
                    </div>

                    {/* ================= Final CTA ================= */}
                    <Reveal className="mt-24">
                        <div className="pr-cta">
                            <h2 className="text-3xl font-extrabold text-white md:text-4xl">Ready to buy?</h2>
                            <p className="mx-auto mt-3 max-w-xl text-cyan-50">
                                Call or message us for today's price and availability.
                            </p>
                            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                                <a
                                    href={`tel:${SHOP.phone}`}
                                    className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-slate-950 shadow-lg transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e7490]"
                                >
                                    📞 Call Now
                                </a>
                                <a
                                    href={waLink("Hello, I want to know the price and availability of a product.")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-900/30 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e7490]"
                                >
                                    💬 WhatsApp
                                </a>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-2 rounded-xl border-2 border-white/70 px-6 py-3 font-bold text-white transition-all hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e7490]"
                                >
                                    📍 Visit our shop
                                </Link>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {selected && <Modal p={selected} onClose={close} returnFocus={triggerRef.current} />}
        </div>
    );
}