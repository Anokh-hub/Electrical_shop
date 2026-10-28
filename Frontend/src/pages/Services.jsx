import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"; // <-- Navbar import kiya
import Reveal from "../components/Reveal";
import Counter from "../components/Counter";
import { SERVICES, STEPS, FAQS, STATS, VALUES, SHOP, waLink } from "../data/siteData";
import { btnPrimary, btnWhatsApp, iconBox } from "../components/ui";

const MARQUEE = [
    "Home Wiring", "LED Lighting", "Switches & Sockets", "MCB & DB Boxes",
    "Fans", "Earthing", "Repairs", "Shop Fit-outs",
];

/* ================= Hero: 3D orbit scene (mouse + scroll + time) ================= */
function OrbitScene() {
    const sceneRef = useRef(null);

    useEffect(() => {
        const el = sceneRef.current;
        if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        let raf = 0;
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                el.style.setProperty("--scroll", Math.min(window.scrollY / 600, 1).toFixed(3));
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(raf);
        };
    }, []);

    const handleMove = (e) => {
        const el = sceneRef.current;
        if (!el) return;
        const r = e.currentTarget.getBoundingClientRect();
        el.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        el.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    };

    const handleLeave = () => {
        const el = sceneRef.current;
        if (!el) return;
        el.style.setProperty("--mx", 0);
        el.style.setProperty("--my", 0);
    };

    return (
        <div className="sv-stage" onMouseMove={handleMove} onMouseLeave={handleLeave} aria-hidden="true">
            <div ref={sceneRef} className="sv-scene">
                <div className="sv-glow" />
                <div className="sv-path" />
                <div className="sv-path sv-path-2" />

                <div className="sv-core">
                    {["f", "b", "r", "l", "t", "bt"].map((k) => (
                        <span key={k} className={`sv-face sv-face-${k}`}>⚡</span>
                    ))}
                </div>

                <div className="sv-ring">
                    {SERVICES.map((s, i) => (
                        <div key={s.title} className="sv-orb" style={{ "--a": `${i * 60}deg` }}>
                            <div className="sv-orb-in">
                                <span className="text-2xl">{s.icon}</span>
                                <span className="mt-1 px-1 text-center text-[10px] font-semibold leading-tight text-cyan-100">
                                    {s.title}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ================= Service card: mouse par 3D tilt + glare ================= */
function ServiceCard({ s, i }) {
    const ref = useRef(null);

    const move = (e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty("--rx", `${(0.5 - y) * 12}deg`);
        el.style.setProperty("--ry", `${(x - 0.5) * 14}deg`);
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
        <Reveal delay={i * 90} className="h-full">
            <article
                ref={ref}
                onMouseMove={move}
                onMouseLeave={leave}
                className="sv-card relative flex h-full flex-col rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-slate-900/90 to-slate-950/80 p-7 shadow-xl shadow-cyan-950/20 transition-all duration-300 hover:border-cyan-400 hover:shadow-cyan-500/20"
            >
                <span className="sv-glare" />
                <span className="pointer-events-none absolute right-6 top-4 text-6xl font-black text-cyan-400/[0.07]">
                    {String(i + 1).padStart(2, "0")}
                </span>

                <div className="sv-pop">
                    <div
                        className={`${iconBox} sv-bob h-14 w-14 rounded-xl border border-cyan-400/40 bg-cyan-950/60 text-3xl text-cyan-300 shadow-md shadow-cyan-500/10`}
                        style={{ animationDelay: `${i * 0.4}s` }}
                    >
                        {s.icon}
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">{s.title}</h3>
                    <p className="mt-2 leading-relaxed text-slate-300">{s.details}</p>
                </div>

                <ul className="mt-5 space-y-2.5 text-sm text-slate-300">
                    {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-bold text-slate-950 shadow-sm shadow-cyan-400/50">✓</span>
                            <span>{b}</span>
                        </li>
                    ))}
                </ul>

                <a
                    href={waLink(`Hello, I want to know more about ${s.title}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 pt-2 text-sm font-semibold text-cyan-300 outline-none transition-colors hover:text-cyan-200 focus-visible:underline"
                >
                    Ask about this service <span aria-hidden="true" className="text-cyan-400">›</span>
                </a>
            </article>
        </Reveal>
    );
}

/* ================= 3D flip card ================= */
function FlipCard({ v }) {
    return (
        <div className="sv-flip" tabIndex={0}>
            <div className="sv-flip-in">
                <div className="sv-flip-face flex flex-col items-center justify-center rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-6 text-center backdrop-blur-sm">
                    <div className={`${iconBox} h-14 w-14 rounded-xl border border-cyan-400/30 bg-cyan-950/50 text-3xl text-cyan-300 shadow-inner`}>
                        {v.icon}
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-white">{v.title}</h3>
                    <p className="mt-2 text-xs text-cyan-300/70">Hover or tap to read more</p>
                </div>
                <div className="sv-flip-face sv-flip-back flex items-center justify-center rounded-2xl border border-cyan-400/50 bg-gradient-to-br from-cyan-600 to-blue-700 p-6 text-center shadow-xl shadow-cyan-900/40">
                    <p className="font-semibold leading-relaxed text-white">{v.text}</p>
                </div>
            </div>
        </div>
    );
}

/* ================= FAQ accordion ================= */
function Faq() {
    const [open, setOpen] = useState(0);
    return (
        <div className="mx-auto max-w-3xl space-y-3.5">
            {FAQS.map((f, i) => {
                const isOpen = open === i;
                return (
                    <div
                        key={f.q}
                        className={`rounded-2xl border transition-all duration-300 ${isOpen
                                ? "border-cyan-400/60 bg-slate-900/90 shadow-lg shadow-cyan-950/40"
                                : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                            }`}
                    >
                        <button
                            type="button"
                            aria-expanded={isOpen}
                            onClick={() => setOpen(isOpen ? -1 : i)}
                            className="flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                        >
                            <span>{f.q}</span>
                            <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-base font-bold transition-all duration-300 ${isOpen
                                        ? "rotate-45 bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/40"
                                        : "bg-slate-800 text-cyan-300 border border-slate-700"
                                    }`}
                            >
                                +
                            </span>
                        </button>
                        <div
                            className="grid transition-[grid-template-rows] duration-300"
                            style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                        >
                            <div className="overflow-hidden">
                                <p className="px-6 pb-5 leading-relaxed text-slate-300">{f.a}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function SectionHead({ eyebrow, title, text }) {
    return (
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">{eyebrow}</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">{title}</h2>
            {text && <p className="mt-4 text-slate-300">{text}</p>}
        </Reveal>
    );
}

/* ================= Page ================= */
export default function Services() {
    return (
        <div className="min-h-screen bg-[#070d1e] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
            {/* Top Navigation Bar */}
            <Navbar />

            <style>{`
                /* ----- hero text ----- */
                .sv-mask { display: block; overflow: hidden; padding-bottom: .12em; }
                .sv-up { display: block; animation: sv-up .9s cubic-bezier(.2, .8, .2, 1) both; }
                @keyframes sv-up { from { transform: translateY(110%); } to { transform: none; } }
                .sv-fade { animation: sv-fade .8s cubic-bezier(.2, .8, .2, 1) both; }
                @keyframes sv-fade { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }

                /* ----- 3D orbit scene ----- */
                .sv-stage { --r: 165px; --orb: 96px; perspective: 1000px; height: 400px; display: grid; place-items: center; }
                @media (max-width: 640px) { .sv-stage { --r: 112px; --orb: 80px; height: 320px; } }
                .sv-scene {
                    position: relative; width: 0; height: 0; transform-style: preserve-3d;
                    transform: rotateX(calc(16deg + var(--my, 0) * -16deg + var(--scroll, 0) * 35deg)) rotateY(calc(var(--mx, 0) * 28deg));
                    transition: transform .25s ease-out;
                }
                .sv-glow { position: absolute; width: 380px; height: 380px; left: -190px; top: -190px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(6, 182, 212, .32), transparent 65%); transform: translateZ(-90px); }
                .sv-path { position: absolute; width: calc(var(--r) * 2); height: calc(var(--r) * 2); left: calc(var(--r) * -1); top: calc(var(--r) * -1);
                    border-radius: 50%; border: 1px dashed rgba(6, 182, 212, .4); transform: rotateX(90deg); }
                .sv-path-2 { transform: rotateX(90deg) scale(.6); border-color: rgba(59, 130, 246, .35); }
                .sv-core { position: absolute; left: -45px; top: -45px; width: 90px; height: 90px; transform-style: preserve-3d; animation: sv-core 14s linear infinite; }
                @keyframes sv-core { from { transform: rotateX(20deg) rotateY(0); } to { transform: rotateX(20deg) rotateY(360deg); } }
                .sv-face { position: absolute; inset: 0; display: grid; place-items: center; font-size: 38px; border-radius: 14px;
                    background: linear-gradient(135deg, #0284c7, #0f172a); border: 1.5px solid rgba(56, 189, 248, .8); box-shadow: inset 0 0 24px rgba(6, 182, 212, .4); }
                .sv-face-f { transform: translateZ(45px); } .sv-face-b { transform: rotateY(180deg) translateZ(45px); }
                .sv-face-r { transform: rotateY(90deg) translateZ(45px); } .sv-face-l { transform: rotateY(-90deg) translateZ(45px); }
                .sv-face-t { transform: rotateX(90deg) translateZ(45px); } .sv-face-bt { transform: rotateX(-90deg) translateZ(45px); }
                .sv-ring { position: absolute; left: 0; top: 0; transform-style: preserve-3d; animation: sv-orbit 24s linear infinite; }
                @keyframes sv-orbit { to { transform: rotateY(360deg); } }
                .sv-orb { position: absolute; width: var(--orb); height: var(--orb); left: calc(var(--orb) / -2); top: calc(var(--orb) / -2);
                    transform-style: preserve-3d; transform: rotateY(var(--a)) translateZ(var(--r)); }
                .sv-orb-in { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;
                    border-radius: 18px; background: rgba(15, 23, 42, .92); border: 1px solid rgba(56, 189, 248, .45); box-shadow: 0 10px 24px rgba(0, 0, 0, .55);
                    animation: sv-face 24s linear infinite; backdrop-blur-md: blur(4px); }
                @keyframes sv-face { from { transform: rotateY(calc(var(--a) * -1)); } to { transform: rotateY(calc(var(--a) * -1 - 360deg)); } }

                /* ----- marquee ----- */
                .sv-marquee-track { display: flex; width: max-content; animation: sv-marq 30s linear infinite; }
                .sv-marquee:hover .sv-marquee-track { animation-play-state: paused; }
                @keyframes sv-marq { to { transform: translateX(-50%); } }

                /* ----- cards ----- */
                .sv-card { transform-style: preserve-3d; transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
                    transition: transform .2s ease-out, border-color .3s, box-shadow .3s; }
                .sv-pop { transform: translateZ(34px); }
                .sv-glare { position: absolute; inset: 0; border-radius: inherit; opacity: 0; pointer-events: none; transition: opacity .3s;
                    background: radial-gradient(280px circle at var(--gx, 50%) var(--gy, 50%), rgba(56, 189, 248, .18), transparent 60%); }
                .sv-card:hover .sv-glare { opacity: 1; }
                .sv-bob { animation: sv-bob 4.5s ease-in-out infinite alternate; }
                @keyframes sv-bob { from { transform: translateY(0) rotate(-4deg); } to { transform: translateY(-8px) rotate(4deg); } }

                /* ----- process ----- */
                .sv-steps-line { transform: scaleX(0); transform-origin: left; transition: transform 1.4s cubic-bezier(.3, .7, .3, 1) .4s; }
                .rv-in .sv-steps-line { transform: scaleX(1); }
                .sv-coin { transform: perspective(500px) rotateY(180deg); opacity: 0; transition: transform .9s cubic-bezier(.2, .8, .2, 1), opacity .4s; }
                .rv-in .sv-coin { transform: perspective(500px) rotateY(0); opacity: 1; }

                /* ----- flip card ----- */
                .sv-flip { perspective: 900px; height: 210px; outline: none; }
                .sv-flip-in { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform .7s cubic-bezier(.3, .7, .3, 1); }
                .sv-flip:hover .sv-flip-in, .sv-flip:focus .sv-flip-in { transform: rotateY(180deg); }
                .sv-flip:focus-visible .sv-flip-in { box-shadow: 0 0 0 2px #38bdf8; border-radius: 16px; }
                .sv-flip-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
                .sv-flip-back { transform: rotateY(180deg); }

                @media (prefers-reduced-motion: reduce) {
                    .sv-up, .sv-fade, .sv-core, .sv-ring, .sv-bob, .sv-marquee-track { animation: none; }
                    .sv-orb-in { animation: none; transform: rotateY(calc(var(--a) * -1)); }
                    .sv-scene, .sv-card, .sv-flip-in { transition: none; }
                    .sv-card { transform: none; }
                    .sv-steps-line, .sv-coin { transform: none; opacity: 1; transition: none; }
                }
            `}</style>

            {/* ===== Hero ===== */}
            <section className="relative isolate overflow-hidden border-b border-cyan-500/10 bg-gradient-to-b from-[#0e172e] via-[#0a1124] to-[#070d1e]">
                <div
                    className="absolute inset-0 -z-10 opacity-40"
                    aria-hidden="true"
                    style={{
                        backgroundImage: "linear-gradient(rgba(56,189,248,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,.12) 1px, transparent 1px)",
                        backgroundSize: "52px 52px",
                        WebkitMaskImage: "radial-gradient(ellipse at 30% 50%, #000 20%, transparent 75%)",
                        maskImage: "radial-gradient(ellipse at 30% 50%, #000 20%, transparent 75%)",
                    }}
                />
                <div className="mx-auto grid max-w-7xl items-center gap-6 px-6 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
                    <div>
                        <nav aria-label="Breadcrumb" className="sv-fade text-sm text-slate-400">
                            <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
                            <span className="mx-2 text-slate-600">/</span>
                            <span className="text-cyan-300 font-medium">Services</span>
                        </nav>

                        <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                            <span className="sv-mask"><span className="sv-up" style={{ animationDelay: ".1s" }}>Electrical services,</span></span>
                            <span className="sv-mask">
                                <span className="sv-up bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent" style={{ animationDelay: ".25s" }}>
                                    done right.
                                </span>
                            </span>
                        </h1>

                        <p className="sv-fade mt-6 max-w-xl text-lg leading-relaxed text-slate-300" style={{ animationDelay: ".5s" }}>
                            From a single switchboard to wiring an entire building, we handle
                            installation, repair and safety, and we help you choose the right
                            products so the job lasts.
                        </p>

                        <div className="sv-fade mt-8 flex flex-wrap gap-4" style={{ animationDelay: ".7s" }}>
                            <a
                                href={waLink("Hello, I need a quote for an electrical service.")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:-translate-y-0.5 hover:shadow-cyan-500/40"
                            >
                                💬 Get a free quote
                            </a>
                            <a
                                href={`tel:${SHOP.phone}`}
                                className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-slate-900/60 px-6 py-3 font-semibold text-cyan-200 backdrop-blur-sm transition-all hover:border-cyan-400 hover:bg-slate-800"
                            >
                                📞 Call {SHOP.phoneDisplay}
                            </a>
                        </div>
                    </div>

                    <OrbitScene />
                </div>
            </section>

            {/* ===== Marquee ===== */}
            <div className="sv-marquee overflow-hidden border-b border-cyan-500/10 bg-[#0a1226] py-4" aria-hidden="true">
                <div className="sv-marquee-track">
                    {[...MARQUEE, ...MARQUEE].map((w, i) => (
                        <span key={i} className="flex items-center whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-slate-300">
                            <span className="mx-8 text-cyan-400">⚡</span>
                            {w}
                        </span>
                    ))}
                </div>
            </div>

            {/* ===== Services grid ===== */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-7xl">
                    <SectionHead
                        eyebrow="What we offer"
                        title="Everything electrical, under one roof"
                        text="Pick a service below. Each one comes with clear pricing, tested work and honest advice."
                    />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {SERVICES.map((s, i) => (
                            <ServiceCard key={s.title} s={s} i={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== Process ===== */}
            <section className="border-y border-cyan-500/10 bg-[#091124] px-6 py-20">
                <div className="mx-auto max-w-5xl">
                    <SectionHead eyebrow="How it works" title="Simple from the first call" />
                    <Reveal>
                        <div className="relative grid gap-10 md:grid-cols-3">
                            <div className="sv-steps-line absolute left-[16%] right-[16%] top-8 hidden h-0.5 bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 md:block shadow-[0_0_8px_rgba(56,189,248,0.5)]" aria-hidden="true" />
                            {STEPS.map((st, i) => (
                                <div key={st.title} className="relative text-center">
                                    <div
                                        className="sv-coin mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-400 to-sky-300 text-2xl font-extrabold text-slate-950 shadow-xl shadow-cyan-500/30"
                                        style={{ transitionDelay: `${0.3 + i * 0.25}s` }}
                                    >
                                        {i + 1}
                                    </div>
                                    <h3 className="mt-5 text-lg font-bold text-white">{st.title}</h3>
                                    <p className="mx-auto mt-2 max-w-xs text-slate-300">{st.text}</p>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ===== Why us + stats ===== */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-7xl">
                    <SectionHead eyebrow="Why choose us" title="Reasons customers come back" />
                    <div className="grid gap-6 md:grid-cols-3">
                        {VALUES.map((v, i) => (
                            <Reveal key={v.title} delay={i * 100}>
                                <FlipCard v={v} />
                            </Reveal>
                        ))}
                    </div>

                    <Reveal className="mt-12">
                        <div className="grid grid-cols-2 gap-y-8 rounded-3xl border border-cyan-500/20 bg-slate-900/40 px-6 py-8 md:grid-cols-4 backdrop-blur-sm shadow-inner shadow-cyan-950/40">
                            {STATS.map((s) => (
                                <div key={s.label} className="text-center">
                                    <div className="text-3xl font-extrabold text-cyan-300 md:text-4xl drop-shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                                        <Counter to={s.value} suffix={s.suffix} />
                                    </div>
                                    <div className="mt-1 text-sm text-slate-300">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <section className="border-t border-cyan-500/10 bg-[#091124] px-6 py-20">
                <div className="mx-auto max-w-7xl">
                    <SectionHead eyebrow="FAQ" title="Questions we hear often" />
                    <Reveal>
                        <Faq />
                    </Reveal>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="px-6 py-20">
                <Reveal className="mx-auto max-w-5xl">
                    <div className="relative overflow-hidden rounded-3xl border border-cyan-400/40 bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 p-10 text-center text-white shadow-2xl shadow-cyan-900/30 md:p-14">
                        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" aria-hidden="true" />
                        <h2 className="relative text-3xl font-extrabold md:text-4xl">Need an electrician or the right product?</h2>
                        <p className="relative mx-auto mt-3 max-w-xl font-medium text-cyan-50">
                            Call or message us. We will tell you what you need and what it will cost before we start.
                        </p>
                        <div className="relative mt-8 flex flex-wrap justify-center gap-4">
                            <a
                                href={`tel:${SHOP.phone}`}
                                className="rounded-xl bg-slate-950 px-7 py-3.5 font-bold text-cyan-300 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-900 hover:text-white"
                            >
                                📞 Call Now
                            </a>
                            <a
                                href={waLink("Hello, I need help with an electrical service.")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl border-2 border-white/90 bg-white/10 px-7 py-3.5 font-bold backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:text-slate-950"
                            >
                                💬 WhatsApp
                            </a>
                        </div>
                    </div>
                </Reveal>
            </section>
        </div>
    );
}