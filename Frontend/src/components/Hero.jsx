import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Main from "../assets/images/Main.jpeg";

const CALL_LINK = "tel:+918052539606";
const WHATSAPP_LINK = "https://wa.me/918052539606";
const MAP_LINK =
    "https://www.google.com/maps/dir/?api=1&destination=25.76341,83.18535";

/* ---------- EDIT: Apne store ke live numbers ---------- */
const STATS = [
    { value: 5000, suffix: "+", label: "Products in stock" },
    { value: 1000, suffix: "+", label: "Happy customers" },
    { value: 10, suffix: "+", label: "Years of trust" },
    { value: 100, suffix: "%", label: "Genuine products" },
];

const POINTS = [
    "Genuine, branded products",
    "Fair prices, no hidden charges",
    "Expert help choosing the right item",
];

const CATEGORIES = [
    {
        icon: "🔌",
        title: "Wiring & Cables",
        text: "Copper wires, cables and conduits",
        z: 60,
        route: "/products",
    },
    {
        icon: "💡",
        title: "LED Lights",
        text: "Bulbs, panels and decorative lights",
        z: 20,
        route: "/products",
    },
    {
        icon: "🎛️",
        title: "Switches & Sockets",
        text: "Modular switches and plates",
        z: 20,
        route: "/products",
    },
    {
        icon: "🛡️",
        title: "MCB & Safety",
        text: "MCBs, fuses and protection gear",
        z: 90,
        route: "/products",
    },
];

/* ---------- Count-up number component ---------- */
function Counter({ to, suffix = "" }) {
    const ref = useRef(null);
    const [val, setVal] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setVal(to);
            return;
        }

        let raf;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                io.disconnect();
                const start = performance.now();
                const tick = (now) => {
                    const p = Math.min((now - start) / 1600, 1);
                    setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
                    if (p < 1) raf = requestAnimationFrame(tick);
                };
                raf = requestAnimationFrame(tick);
            },
            { threshold: 0.4 }
        );
        io.observe(el);

        return () => {
            io.disconnect();
            cancelAnimationFrame(raf);
        };
    }, [to]);

    return (
        <span ref={ref}>
            {val.toLocaleString("en-IN")}
            {suffix}
        </span>
    );
}

/* ---------- 3D Card Cluster with smooth tilt & click ---------- */
function CardCluster() {
    const ref = useRef(null);
    const navigate = useNavigate();

    const handleMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;

        // Smooth dynamic rotation formulas
        const rx = 8 - y * 24;
        const ry = -14 + x * 28;

        el.style.setProperty("--rx", `${rx}deg`);
        el.style.setProperty("--ry", `${ry}deg`);
    };

    const handleLeave = () => {
        const el = ref.current;
        if (!el) return;
        el.style.removeProperty("--rx");
        el.style.removeProperty("--ry");
    };

    return (
        <div
            className="eh-stage mx-auto w-full max-w-md select-none"
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
        >
            <div ref={ref} className="eh-scene relative">
                {/* Glow peek peeche */}
                <div
                    className="absolute -inset-8 rounded-full bg-yellow-400/20 blur-3xl"
                    style={{ transform: "translateZ(-80px)" }}
                    aria-hidden="true"
                />

                <div className="eh-grid-3d grid grid-cols-2 gap-5">
                    {CATEGORIES.map((c, i) => (
                        <div
                            key={c.title}
                            className={`cursor-pointer ${i % 2 === 1 ? "mt-10" : ""}`}
                            style={{ transform: `translateZ(${c.z}px)` }}
                            onClick={() => navigate(c.route)}
                            title="Click to view details"
                        >
                            <div
                                className="eh-float rounded-2xl border border-white/20 bg-white/10 p-5 shadow-2xl shadow-black/40 backdrop-blur-md transition-all duration-300 hover:border-yellow-400/60 hover:bg-white/15"
                                style={{ animationDelay: `${i * 0.7}s` }}
                            >
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400 text-2xl shadow-lg shadow-yellow-400/30">
                                    {c.icon}
                                </div>
                                <h3 className="font-bold text-white">{c.title}</h3>
                                <p className="mt-1 text-sm leading-snug text-slate-300">
                                    {c.text}
                                </p>
                                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-yellow-300">
                                    Explore &rarr;
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Floating badge */}
                <div
                    className="absolute -bottom-5 left-1/2 -translate-x-1/2 pointer-events-none"
                    style={{ transform: "translateX(-50%) translateZ(130px)" }}
                >
                    <div
                        className="eh-float whitespace-nowrap rounded-full bg-[#0b1530] px-5 py-2.5 text-sm font-semibold text-yellow-300 shadow-xl shadow-black/50 ring-1 ring-yellow-400/60"
                        style={{ animationDelay: "1.2s" }}
                    >
                        ✔ Genuine brands only
                    </div>
                </div>
            </div>
        </div>
    );
}

function Hero() {
    return (
        <section
            id="home"
            className="relative isolate flex min-h-[720px] items-center overflow-hidden bg-[#0b1530]"
        >
            <style>{`
        /* ===== Background Animations ===== */
        .eh-bg { 
          animation: eh-zoom 24s ease-in-out infinite alternate; 
        }
        @keyframes eh-zoom { 
          from { transform: scale(1); } 
          to { transform: scale(1.08); } 
        }
        
        .eh-grid-lines {
          background-image:
            linear-gradient(rgba(250, 204, 21, .07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250, 204, 21, .07) 1px, transparent 1px);
          background-size: 52px 52px;
          -webkit-mask-image: radial-gradient(ellipse at 30% 40%, #000 20%, transparent 75%);
          mask-image: radial-gradient(ellipse at 30% 40%, #000 20%, transparent 75%);
        }

        /* ===== Entrance Sequence ===== */
        .eh-rise { animation: eh-rise .75s cubic-bezier(.2, .8, .2, 1) both; }
        @keyframes eh-rise { 
          from { opacity: 0; transform: translateY(22px); } 
          to { opacity: 1; transform: none; } 
        }
        
        .eh-mask { display: block; overflow: hidden; padding-bottom: .12em; }
        .eh-line { display: block; animation: eh-line .9s cubic-bezier(.2, .8, .2, 1) both; }
        @keyframes eh-line { 
          from { transform: translateY(110%); } 
          to { transform: none; } 
        }
        
        .eh-stage-in { animation: eh-stage-in 1.1s cubic-bezier(.2, .8, .2, 1) .5s both; }
        @keyframes eh-stage-in { 
          from { opacity: 0; transform: translateX(40px) scale(.94); } 
          to { opacity: 1; transform: none; } 
        }

        /* ===== Pulse Dot ===== */
        .eh-dot { animation: eh-pulse 1.8s ease-out infinite; }
        @keyframes eh-pulse {
          0% { box-shadow: 0 0 0 0 rgba(250, 204, 21, .7); }
          100% { box-shadow: 0 0 0 10px rgba(250, 204, 21, 0); }
        }

        /* ===== 3D Perspective Cluster ===== */
        .eh-stage { perspective: 1100px; }
        .eh-scene {
          transform-style: preserve-3d;
          transform: rotateX(var(--rx, 8deg)) rotateY(var(--ry, -14deg));
          transition: transform .25s ease-out;
        }
        .eh-grid-3d { transform-style: preserve-3d; }
        .eh-float { animation: eh-float 5.5s ease-in-out infinite alternate; }
        @keyframes eh-float { 
          from { transform: translateY(0); } 
          to { transform: translateY(-12px); } 
        }

        /* ===== Button Effects & Glow ===== */
        .eh-btn { transition: transform .15s, box-shadow .15s, background-color .2s, color .2s; }
        .eh-btn:hover { transform: translateY(-3px); }
        .eh-btn:active { transform: translateY(2px); }
        
        .eh-call {
          position: relative; 
          overflow: hidden;
          box-shadow: 0 4px 0 #b45309, 0 14px 28px rgba(250, 204, 21, .25);
        }
        .eh-call:hover { background-color: #fde047; }
        .eh-call:active { box-shadow: 0 1px 0 #b45309, 0 4px 10px rgba(250, 204, 21, .25); }
        .eh-call::after {
          content: ""; 
          position: absolute; 
          top: 0; 
          left: -60%; 
          width: 40%; 
          height: 100%;
          background: linear-gradient(100deg, transparent, rgba(255, 255, 255, .7), transparent);
          transform: skewX(-20deg);
          animation: eh-shine 4.5s ease-in-out 2s infinite;
        }
        @keyframes eh-shine { 
          0% { left: -60%; } 
          35%, 100% { left: 140%; } 
        }

        @media (prefers-reduced-motion: reduce) {
          .eh-bg, .eh-rise, .eh-line, .eh-stage-in, .eh-dot, .eh-float, .eh-call::after { animation: none; }
          .eh-scene, .eh-btn { transition: none; }
        }
      `}</style>

            {/* Background Image Layer */}
            <div
                className="eh-bg absolute inset-0 -z-30 bg-cover bg-center"
                style={{ backgroundImage: `url(${Main})` }}
                aria-hidden="true"
            />

            {/* Dynamic Overlays */}
            <div
                className="absolute inset-0 -z-20 bg-gradient-to-r from-[#0b1530] via-[#0b1530]/90 to-[#0b1530]/50"
                aria-hidden="true"
            />
            <div className="eh-grid-lines absolute inset-0 -z-10" aria-hidden="true" />
            <div
                className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-[#0b1530] to-transparent"
                aria-hidden="true"
            />

            {/* Main Container */}
            <div className="relative mx-auto w-full max-w-7xl px-6 py-16 lg:py-20">
                <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
                    {/* Left Hero Content */}
                    <div>
                        <p
                            className="eh-rise inline-flex items-center gap-2 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-4 py-1.5 text-sm font-semibold text-yellow-300"
                            style={{ animationDelay: ".1s" }}
                        >
                            <span className="eh-dot h-2 w-2 rounded-full bg-yellow-400" />
                            Trusted Electrical Store
                        </p>

                        <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                            <span className="eh-mask">
                                <span className="eh-line" style={{ animationDelay: ".25s" }}>
                                    Quality Electrical
                                </span>
                            </span>
                            <span className="eh-mask">
                                <span
                                    className="eh-line bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent"
                                    style={{ animationDelay: ".4s" }}
                                >
                                    Products &amp; Services
                                </span>
                            </span>
                        </h1>

                        <p
                            className="eh-rise mt-6 max-w-xl text-lg leading-relaxed text-slate-300"
                            style={{ animationDelay: ".6s" }}
                        >
                            From home wiring to full shop fit-outs: switches, cables, LED
                            lights, fans, MCBs and every accessory you need, all under one
                            roof. Good quality at reasonable prices, with honest advice on
                            what to buy.
                        </p>

                        <ul
                            className="eh-rise mt-6 space-y-2.5"
                            style={{ animationDelay: ".75s" }}
                        >
                            {POINTS.map((p) => (
                                <li key={p} className="flex items-center gap-3 text-slate-200">
                                    <span
                                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-[#0b1530]"
                                        aria-hidden="true"
                                    >
                                        ✓
                                    </span>
                                    {p}
                                </li>
                            ))}
                        </ul>

                        {/* Quick Action CTAs */}
                        <div
                            className="eh-rise mt-9 flex flex-wrap gap-4"
                            style={{ animationDelay: ".9s" }}
                        >
                            <a
                                href={CALL_LINK}
                                className="eh-btn eh-call inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3.5 font-bold text-[#0b1530] outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1530]"
                            >
                                📞 Call Now
                            </a>

                            <a
                                href={WHATSAPP_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="eh-btn inline-flex items-center gap-2 rounded-xl border border-[#25D366]/60 bg-[#25D366]/10 px-6 py-3.5 font-semibold text-white outline-none hover:bg-[#25D366] hover:text-[#06210f] focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1530]"
                            >
                                💬 WhatsApp
                            </a>

                            <a
                                href={MAP_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="eh-btn inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-semibold text-white outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1530]"
                            >
                                📍 Get Directions
                            </a>
                        </div>
                    </div>

                    {/* Right 3D Interactive Cards */}
                    <div className="eh-stage-in">
                        <CardCluster />
                    </div>
                </div>

                {/* Dynamic Animated Statistics Bar */}
                <div
                    className="eh-rise mt-16 grid grid-cols-2 gap-y-6 rounded-2xl border border-white/15 bg-white/5 px-6 py-6 backdrop-blur-md md:grid-cols-4"
                    style={{ animationDelay: "1.1s" }}
                >
                    {STATS.map((s) => (
                        <div key={s.label} className="text-center">
                            <div className="text-3xl font-extrabold text-yellow-400 md:text-4xl">
                                <Counter to={s.value} suffix={s.suffix} />
                            </div>
                            <div className="mt-1 text-sm text-slate-300">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Hero;