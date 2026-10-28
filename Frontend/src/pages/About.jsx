import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"; // <-- Navbar import kiya

const PHONE_NUMBER = "+918052539606";
const WHATSAPP = "https://wa.me/918052539606";

const FEATURES = [
    { icon: "✅", title: "Quality Products", text: "100% genuine wiring, switches, MCBs aur LED lights, sirf trusted brands ke." },
    { icon: "💰", title: "Reasonable Prices", text: "Sahi rate, bina kisi hidden charge ke. Bulk order par special discount." },
    { icon: "🛠️", title: "Trusted Service", text: "Ghar, dukaan aur office ke liye bharosemand electrical solutions." },
    { icon: "🤝", title: "Customer Support", text: "Product chunne se lekar installation tak, har kadam par madad." },
];

const STATS = [
    { value: 100, suffix: "+", label: "Products" },
    { value: 1000, suffix: "+", label: "Customers" },
    { value: 5, suffix: "+", label: "Years Experience" },
    { value: 100, suffix: "%", label: "Genuine Products" },
];

const ORBIT = ["💡", "🔌", "🔋", "🔦", "🪛", "⚙️"];

const MISSION_VISION = [
    {
        icon: "🎯",
        title: "Our Mission",
        text: "Har ghar, dukaan aur office tak genuine electrical products sahi daam par pahunchana, friendly aur imaandaar service ke saath.",
    },
    {
        icon: "🔭",
        title: "Our Vision",
        text: "Apne area ki sabse bharosemand electrical dukaan banna, jahan customer bina doubt ke bharose se kharid sake.",
    },
];

const CATEGORIES = [
    { icon: "🔌", title: "Wires & Cables", items: ["House wiring", "Copper cables", "Flexible wires"] },
    { icon: "🎛️", title: "Switches & Sockets", items: ["Modular switches", "Sockets & plates", "Regulators"] },
    { icon: "💡", title: "LED Lights", items: ["LED bulbs", "Tube lights", "Panel & decorative lights"] },
    { icon: "⚡", title: "MCB & Protection", items: ["MCBs", "Distribution boards", "Fuses & isolators"] },
    { icon: "🌀", title: "Fans", items: ["Ceiling fans", "Exhaust fans", "Table & wall fans"] },
    { icon: "🧰", title: "Accessories", items: ["Holders & connectors", "Insulation tape", "Conduit & fittings"] },
];

const STEPS = [
    { icon: "💬", title: "Batayein kya chahiye", text: "Call, WhatsApp ya dukaan par aakar apni zaroorat batayein." },
    { icon: "🔍", title: "Sahi product chunein", text: "Hum aapke kaam ke hisaab se genuine product suggest karte hain." },
    { icon: "🧾", title: "Fair price par kharidein", text: "Saaf rate, bina hidden charge. Bulk order par better deal." },
    { icon: "🛟", title: "Kharidne ke baad bhi support", text: "Koi sawal ya dikkat ho to hum madad ke liye taiyaar hain." },
];

const FAQS = [
    {
        q: "Kya aapke products genuine hain?",
        a: "Haan, hum sirf genuine aur trusted brands ke products rakhte hain, taaki aapki wiring aur safety par bharosa bana rahe.",
    },
    {
        q: "Kya bulk ya contractor orders par special rate milta hai?",
        a: "Haan, bulk order par special discount milta hai. Rate jaanne ke liye hamein call ya WhatsApp karein.",
    },
    {
        q: "Mujhe samajh nahi aa raha ki kaunsa product lena chahiye?",
        a: "Koi baat nahi. Dukaan par aayein ya call karein, hum aapke kaam aur budget ke hisaab se sahi product suggest karenge.",
    },
    {
        q: "Kya main WhatsApp par enquiry kar sakta hoon?",
        a: "Bilkul. WhatsApp par product ka naam ya photo bhejein, hum aapko availability aur rate bata denge.",
    },
    {
        q: "Dukaan kahan hai?",
        a: "Parmanpur, Maulanipur, Uttar Pradesh 276123. Contact page par map aur directions bhi diye gaye hain.",
    },
];

/* ---------- Scroll mein dikhne par true ---------- */
function useInView(threshold = 0.2) {
    const ref = useRef(null);
    const [seen, setSeen] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setSeen(true);
                    io.disconnect();
                }
            },
            { threshold }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [threshold]);

    return [ref, seen];
}

/* ---------- Reveal wrapper (har block ke liye) ---------- */
function Reveal({ children, className = "", threshold = 0.15 }) {
    const [ref, seen] = useInView(threshold);
    return (
        <div ref={ref} className={`ab-reveal ${seen ? "is-in" : ""} ${className}`}>
            {children}
        </div>
    );
}

/* ---------- Section heading ---------- */
function Heading({ tag, title, text }) {
    return (
        <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="inline-block rounded-full border border-yellow-400/50 bg-yellow-400/10 px-4 py-1 text-sm font-semibold text-yellow-400">
                {tag}
            </p>
            <h3 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                {title}
            </h3>
            {text && <p className="mt-3 text-slate-300">{text}</p>}
        </div>
    );
}

/* ---------- Count-up number ---------- */
function Counter({ to, suffix = "", start }) {
    const [n, setN] = useState(0);

    useEffect(() => {
        if (!start) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) {
            setN(to);
            return;
        }
        let raf;
        const t0 = performance.now();
        const dur = 1600;
        const tick = (t) => {
            const p = Math.min((t - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(to * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [start, to]);

    return (
        <>
            {n}
            {suffix}
        </>
    );
}

/* ---------- 3D tilt + glare card ---------- */
function TiltCard({ children, className = "", max = 10 }) {
    const ref = useRef(null);

    const move = (e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty("--rx", `${(0.5 - y) * max}deg`);
        el.style.setProperty("--ry", `${(x - 0.5) * max}deg`);
        el.style.setProperty("--mx", `${x * 100}%`);
        el.style.setProperty("--my", `${y * 100}%`);
    };

    const leave = () => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
    };

    return (
        <div
            ref={ref}
            onMouseMove={move}
            onMouseLeave={leave}
            className={`ab-tilt ${className}`}
        >
            {children}
            <span className="ab-glare" aria-hidden="true" />
        </div>
    );
}

/* ---------- Flip card ---------- */
function FlipCard({ icon, title, text }) {
    return (
        <div className="ab-flip" tabIndex={0}>
            <div className="ab-flip-inner">
                <div className="ab-flip-face ab-flip-front">
                    <span className="ab-icon">{icon}</span>
                    <span className="mt-4 text-lg font-bold text-white">{title}</span>
                </div>
                <div className="ab-flip-face ab-flip-back">
                    <span className="text-lg font-bold text-[#0b1530]">{title}</span>
                    <span className="mt-2 text-sm leading-relaxed text-[#0b1530]/80">{text}</span>
                </div>
            </div>
        </div>
    );
}

/* ---------- FAQ accordion item ---------- */
function FaqItem({ q, a, open, onToggle, id }) {
    return (
        <div className={`ab-faq ${open ? "is-open" : ""}`}>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls={`${id}-panel`}
                id={`${id}-btn`}
                className="ab-faq-btn"
            >
                <span className="text-left font-semibold text-white">{q}</span>
                <span className="ab-faq-plus" aria-hidden="true" />
            </button>
            <div
                id={`${id}-panel`}
                role="region"
                aria-labelledby={`${id}-btn`}
                className="ab-faq-panel"
            >
                <div className="overflow-hidden">
                    <p className="px-5 pb-5 leading-relaxed text-slate-300">{a}</p>
                </div>
            </div>
        </div>
    );
}

/* ---------- 3D orbit scene ---------- */
function OrbitScene() {
    const ref = useRef(null);

    const move = (e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--px", `${x * 24}deg`);
        el.style.setProperty("--py", `${-y * 18}deg`);
    };

    const leave = () => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--px", "0deg");
        el.style.setProperty("--py", "0deg");
    };

    return (
        <div
            ref={ref}
            onMouseMove={move}
            onMouseLeave={leave}
            className="ab-scene"
            aria-hidden="true"
        >
            <div className="ab-stage">
                <div className="ab-ring" />
                <div className="ab-core">
                    <div className="ab-cube">
                        <span className="ab-face ab-f1">⚡</span>
                        <span className="ab-face ab-f2">⚡</span>
                        <span className="ab-face ab-f3">⚡</span>
                        <span className="ab-face ab-f4">⚡</span>
                        <span className="ab-face ab-f5">⚡</span>
                        <span className="ab-face ab-f6">⚡</span>
                    </div>
                </div>
                <div className="ab-orbit">
                    {ORBIT.map((ic, i) => (
                        <span
                            key={ic}
                            className="ab-orb"
                            style={{ "--a": `${(360 / ORBIT.length) * i}deg` }}
                        >
                            <span className="ab-orb-chip">{ic}</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function About() {
    const [leftRef, leftSeen] = useInView();
    const [rightRef, rightSeen] = useInView();
    const [flipRef, flipSeen] = useInView(0.15);
    const [statRef, statSeen] = useInView(0.3);
    const [openFaq, setOpenFaq] = useState(0);

    return (
        <div className="min-h-screen bg-[#0b1530] text-white">
            {/* Top Navigation Bar */}
            <Navbar />

            <section
                id="about"
                className="relative overflow-hidden bg-[#0b1530] py-20 text-white"
            >
                <style>{`
                    /* ===== Background grid + glow ===== */
                    .ab-bg {
                        position: absolute; inset: 0; pointer-events: none;
                        background:
                            radial-gradient(600px circle at 15% 10%, rgba(59, 130, 246, .22), transparent 60%),
                            radial-gradient(500px circle at 90% 85%, rgba(250, 204, 21, .12), transparent 60%);
                    }
                    .ab-grid {
                        position: absolute; inset: 0; pointer-events: none; opacity: .35;
                        background-image:
                            linear-gradient(rgba(148, 163, 184, .12) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(148, 163, 184, .12) 1px, transparent 1px);
                        background-size: 44px 44px;
                        mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
                        -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
                    }

                    /* ===== Reveal ===== */
                    .ab-reveal { opacity: 0; transform: translateY(28px); transition: opacity .7s ease, transform .7s cubic-bezier(.2, .8, .2, 1); }
                    .ab-reveal.is-in { opacity: 1; transform: none; }

                    /* ===== Orbit scene ===== */
                    .ab-scene { perspective: 900px; width: 100%; max-width: 420px; height: 380px; margin-inline: auto; display: grid; place-items: center; }
                    .ab-stage {
                        position: relative; width: 300px; height: 300px;
                        transform-style: preserve-3d;
                        transform: rotateX(calc(62deg + var(--py, 0deg))) rotateZ(var(--px, 0deg));
                        transition: transform .25s ease-out;
                    }
                    .ab-ring {
                        position: absolute; inset: 20px; border-radius: 50%;
                        border: 2px dashed rgba(250, 204, 21, .55);
                        box-shadow: 0 0 40px rgba(250, 204, 21, .25), inset 0 0 40px rgba(59, 130, 246, .25);
                    }
                    .ab-core { position: absolute; left: 50%; top: 50%; width: 0; height: 0; transform-style: preserve-3d; transform: rotateX(-62deg); }
                    .ab-cube {
                        --s: 64px; position: absolute; left: calc(var(--s) / -2); top: calc(var(--s) / -2);
                        width: var(--s); height: var(--s); transform-style: preserve-3d;
                        animation: ab-spin 10s linear infinite;
                        filter: drop-shadow(0 0 14px rgba(250, 204, 21, .6));
                    }
                    @keyframes ab-spin {
                        from { transform: rotateX(-24deg) rotateY(0deg); }
                        to   { transform: rotateX(-24deg) rotateY(360deg); }
                    }
                    .ab-face {
                        position: absolute; inset: 0; display: grid; place-items: center; font-size: 28px; color: #facc15;
                        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                        border: 1px solid rgba(250, 204, 21, .85); border-radius: 8px;
                        box-shadow: inset 0 0 16px rgba(250, 204, 21, .25);
                    }
                    .ab-f1 { transform: translateZ(32px); }
                    .ab-f2 { transform: rotateY(180deg) translateZ(32px); }
                    .ab-f3 { transform: rotateY(90deg) translateZ(32px); }
                    .ab-f4 { transform: rotateY(-90deg) translateZ(32px); }
                    .ab-f5 { transform: rotateX(90deg) translateZ(32px); }
                    .ab-f6 { transform: rotateX(-90deg) translateZ(32px); }

                    .ab-orbit { position: absolute; inset: 0; transform-style: preserve-3d; animation: ab-orbit 18s linear infinite; }
                    @keyframes ab-orbit { from { transform: rotateZ(0deg); } to { transform: rotateZ(360deg); } }
                    .ab-orb {
                        position: absolute; left: 50%; top: 50%; width: 0; height: 0;
                        transform-style: preserve-3d;
                        transform: rotateZ(var(--a)) translateX(130px);
                    }
                    .ab-orb-chip {
                        position: absolute; left: -22px; top: -22px; width: 44px; height: 44px;
                        display: grid; place-items: center; font-size: 22px; border-radius: 12px;
                        background: rgba(255, 255, 255, .95); box-shadow: 0 8px 18px rgba(0, 0, 0, .35);
                        transform: rotateZ(calc(var(--a) * -1)) rotateX(-62deg);
                        animation: ab-counter 18s linear infinite;
                    }
                    @keyframes ab-counter {
                        from { transform: rotateZ(calc(var(--a) * -1)) rotateX(-62deg); }
                        to   { transform: rotateZ(calc(var(--a) * -1 - 360deg)) rotateX(-62deg); }
                    }

                    /* ===== Tilt + glare card ===== */
                    .ab-tilt {
                        position: relative; transform-style: preserve-3d;
                        transform: perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
                        transition: transform .2s ease-out;
                        will-change: transform;
                    }
                    .ab-glare {
                        position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0;
                        background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(255, 255, 255, .22), transparent 60%);
                        transition: opacity .25s;
                    }
                    .ab-tilt:hover .ab-glare { opacity: 1; }
                    .ab-depth-1 { transform: translateZ(24px); }
                    .ab-depth-2 { transform: translateZ(44px); }

                    /* ===== Flip cards ===== */
                    .ab-flip { perspective: 800px; height: 170px; outline: none; }
                    .ab-flip-inner {
                        position: relative; width: 100%; height: 100%; transform-style: preserve-3d;
                        transition: transform .7s cubic-bezier(.3, .7, .3, 1);
                    }
                    .ab-flip:hover .ab-flip-inner,
                    .ab-flip:focus-visible .ab-flip-inner { transform: rotateY(180deg); }
                    .ab-flip:focus-visible { box-shadow: 0 0 0 2px #facc15; border-radius: 16px; }
                    .ab-flip-face {
                        position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
                        padding: 18px; text-align: center; border-radius: 16px; backface-visibility: hidden; -webkit-backface-visibility: hidden;
                    }
                    .ab-flip-front {
                        background: linear-gradient(145deg, rgba(59, 130, 246, .28), rgba(29, 78, 216, .12));
                        border: 1px solid rgba(250, 204, 21, .45);
                        box-shadow: 0 14px 30px rgba(0, 0, 0, .35), inset 0 0 24px rgba(59, 130, 246, .18);
                    }
                    .ab-flip-back {
                        background: linear-gradient(145deg, #facc15, #fde047);
                        transform: rotateY(180deg);
                        box-shadow: 0 14px 30px rgba(250, 204, 21, .25);
                    }
                    .ab-icon { font-size: 40px; filter: drop-shadow(0 6px 10px rgba(0, 0, 0, .4)); }

                    /* ===== Stat card ===== */
                    .ab-stat {
                        border-radius: 16px; padding: 22px 16px; text-align: center;
                        background: rgba(255, 255, 255, .06);
                        border: 1px solid rgba(255, 255, 255, .12);
                        box-shadow: 0 6px 0 rgba(250, 204, 21, .55), 0 18px 30px rgba(0, 0, 0, .35);
                        backdrop-filter: blur(6px);
                    }

                    /* ===== Mission / Vision ===== */
                    .ab-mv {
                        border-radius: 18px; padding: 28px;
                        background: linear-gradient(145deg, rgba(59, 130, 246, .24), rgba(29, 78, 216, .08));
                        border: 1px solid rgba(250, 204, 21, .4);
                        box-shadow: 0 16px 34px rgba(0, 0, 0, .35), inset 0 0 26px rgba(59, 130, 246, .15);
                    }
                    .ab-mv-icon {
                        display: grid; place-items: center; width: 56px; height: 56px; border-radius: 14px; font-size: 28px;
                        background: #facc15; box-shadow: 0 4px 0 #b45309, 0 10px 18px rgba(250, 204, 21, .25);
                    }

                    /* ===== Category card ===== */
                    .ab-cat {
                        height: 100%; border-radius: 16px; padding: 24px;
                        background: rgba(255, 255, 255, .06);
                        border: 1px solid rgba(255, 255, 255, .12);
                        box-shadow: 0 6px 0 rgba(59, 130, 246, .55), 0 18px 30px rgba(0, 0, 0, .35);
                        backdrop-filter: blur(6px);
                    }
                    .ab-cat-icon { font-size: 36px; display: inline-block; filter: drop-shadow(0 6px 10px rgba(0, 0, 0, .4)); }
                    .ab-cat li { position: relative; padding-left: 18px; }
                    .ab-cat li::before {
                        content: ""; position: absolute; left: 0; top: .55em; width: 8px; height: 8px; border-radius: 2px;
                        background: #facc15; transform: rotate(45deg);
                    }

                    /* ===== Steps ===== */
                    .ab-steps { position: relative; }
                    @media (min-width: 1024px) {
                        .ab-steps::before {
                            content: ""; position: absolute; left: 12%; right: 12%; top: 36px; height: 0;
                            border-top: 2px dashed rgba(250, 204, 21, .5);
                        }
                    }
                    .ab-step { text-align: center; padding: 0 8px; }
                    .ab-step-badge {
                        position: relative; display: grid; place-items: center; width: 72px; height: 72px; margin: 0 auto;
                        border-radius: 50%; font-size: 30px;
                        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                        border: 2px solid #facc15;
                        box-shadow: 0 6px 0 #b45309, 0 16px 26px rgba(0, 0, 0, .4), inset 0 0 14px rgba(250, 204, 21, .25);
                    }
                    .ab-step-num {
                        position: absolute; top: -6px; right: -6px; width: 26px; height: 26px; border-radius: 50%;
                        display: grid; place-items: center; font-size: 13px; font-weight: 800;
                        background: #facc15; color: #0b1530;
                    }

                    /* ===== FAQ ===== */
                    .ab-faq {
                        border-radius: 14px; overflow: hidden;
                        background: rgba(255, 255, 255, .06);
                        border: 1px solid rgba(255, 255, 255, .12);
                        transition: border-color .25s, box-shadow .25s;
                    }
                    .ab-faq.is-open { border-color: rgba(250, 204, 21, .55); box-shadow: 0 10px 26px rgba(0, 0, 0, .35); }
                    .ab-faq-btn {
                        display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 16px;
                        padding: 18px 20px; background: transparent; border: 0; cursor: pointer;
                    }
                    .ab-faq-btn:focus-visible { outline: 2px solid #facc15; outline-offset: -2px; border-radius: 14px; }
                    .ab-faq-plus { position: relative; width: 18px; height: 18px; flex-shrink: 0; }
                    .ab-faq-plus::before, .ab-faq-plus::after {
                        content: ""; position: absolute; left: 0; top: 50%; width: 100%; height: 2px; margin-top: -1px;
                        background: #facc15; border-radius: 2px; transition: transform .3s ease;
                    }
                    .ab-faq-plus::after { transform: rotate(90deg); }
                    .ab-faq.is-open .ab-faq-plus::after { transform: rotate(0deg); }
                    .ab-faq-panel {
                        display: grid; grid-template-rows: 0fr; visibility: hidden;
                        transition: grid-template-rows .35s ease, visibility .35s;
                    }
                    .ab-faq.is-open .ab-faq-panel { grid-template-rows: 1fr; visibility: visible; }

                    /* ===== CTA banner ===== */
                    .ab-cta {
                        border-radius: 22px; padding: 40px 28px; text-align: center;
                        background: linear-gradient(135deg, #1d4ed8, #3b82f6);
                        border: 1px solid rgba(250, 204, 21, .6);
                        box-shadow: 0 8px 0 rgba(250, 204, 21, .5), 0 26px 44px rgba(0, 0, 0, .45);
                    }
                    .ab-btn {
                        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
                        border-radius: 12px; padding: 12px 22px; font-weight: 600;
                        transition: box-shadow .15s, transform .15s, background-color .2s;
                    }
                    .ab-btn:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
                    .ab-btn-yellow { background: #facc15; color: #0b1530; box-shadow: 0 4px 0 #b45309, 0 12px 22px rgba(250, 204, 21, .25); }
                    .ab-btn-yellow:hover { background: #fde047; }
                    .ab-btn-yellow:active { transform: translateY(3px); box-shadow: 0 1px 0 #b45309, 0 4px 8px rgba(250, 204, 21, .2); }
                    .ab-btn-green { background: #22c55e; color: #052e16; box-shadow: 0 4px 0 #15803d, 0 12px 22px rgba(34, 197, 94, .25); }
                    .ab-btn-green:hover { background: #4ade80; }
                    .ab-btn-green:active { transform: translateY(3px); box-shadow: 0 1px 0 #15803d, 0 4px 8px rgba(34, 197, 94, .2); }

                    /* ===== Float ===== */
                    .ab-float { animation: ab-float 5s ease-in-out infinite; }
                    @keyframes ab-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

                    @media (prefers-reduced-motion: reduce) {
                        .ab-cube, .ab-orbit, .ab-orb-chip, .ab-float { animation: none; }
                        .ab-cube { transform: rotateX(-24deg) rotateY(35deg); }
                        .ab-reveal { opacity: 1; transform: none; transition: none; }
                        .ab-tilt, .ab-flip-inner, .ab-stage, .ab-btn, .ab-faq-panel, .ab-faq-plus::before, .ab-faq-plus::after { transition: none; }
                    }
                    @media (max-width: 480px) {
                        .ab-scene { height: 320px; transform: scale(.85); }
                    }
                `}</style>

                <div className="ab-bg" />
                <div className="ab-grid" />

                <div className="relative mx-auto max-w-7xl px-6">
                    {/* ================= Intro ================= */}
                    <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-2">
                        {/* Left Side */}
                        <div ref={leftRef} className={`ab-reveal ${leftSeen ? "is-in" : ""}`}>
                            <p className="inline-block rounded-full border border-yellow-400/50 bg-yellow-400/10 px-4 py-1 text-sm font-semibold text-yellow-400">
                                About Our Shop
                            </p>

                            <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
                                Your Trusted Electrical Partner
                            </h2>

                            <p className="mt-6 leading-relaxed text-slate-300">
                                We provide quality electrical products and reliable electrical
                                solutions for homes, shops and offices. Our goal is to provide
                                genuine products at reasonable prices with friendly customer
                                service.
                            </p>

                            <p className="mt-4 leading-relaxed text-slate-300">
                                From electrical wiring and switches to LED lights, MCBs and other
                                accessories, we provide a wide range of products under one roof.
                            </p>
                        </div>

                        {/* Right Side: 3D orbit scene */}
                        <div ref={rightRef} className={`ab-reveal ${rightSeen ? "is-in" : ""}`}>
                            <OrbitScene />
                        </div>
                    </div>

                    {/* ================= Feature flip cards ================= */}
                    <div
                        ref={flipRef}
                        className={`ab-reveal mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 ${flipSeen ? "is-in" : ""}`}
                    >
                        {FEATURES.map((f) => (
                            <FlipCard key={f.title} {...f} />
                        ))}
                    </div>

                    {/* ================= Our Story: Mission & Vision ================= */}
                    <div className="mt-24">
                        <Reveal>
                            <Heading
                                tag="Our Story"
                                title="Bharose ke saath shuru hua safar"
                                text="Ek chhoti si dukaan se shuru karke hamara maqsad hamesha ek hi raha: aise products dena jin par aap aankh band karke bharosa kar sakein."
                            />
                        </Reveal>

                        <Reveal className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {MISSION_VISION.map((m) => (
                                <TiltCard key={m.title} className="ab-mv" max={8}>
                                    <div className="ab-depth-2 ab-mv-icon" aria-hidden="true">
                                        {m.icon}
                                    </div>
                                    <h4 className="ab-depth-1 mt-5 text-xl font-bold text-white">{m.title}</h4>
                                    <p className="ab-depth-1 mt-2 leading-relaxed text-slate-300">{m.text}</p>
                                </TiltCard>
                            ))}
                        </Reveal>
                    </div>

                    {/* ================= What We Sell ================= */}
                    <div className="mt-24">
                        <Reveal>
                            <Heading
                                tag="What We Sell"
                                title="Ek hi chhat ke neeche sab kuch"
                                text="Wiring se lekar lights tak, aapke electrical kaam ki har zaroorat ka saaman yahan milta hai."
                            />
                        </Reveal>

                        <Reveal className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {CATEGORIES.map((c) => (
                                <TiltCard key={c.title} className="ab-cat-wrap" max={10}>
                                    <div className="ab-cat">
                                        <span className="ab-cat-icon ab-depth-2" aria-hidden="true">
                                            {c.icon}
                                        </span>
                                        <h4 className="ab-depth-1 mt-3 text-lg font-bold text-white">{c.title}</h4>
                                        <ul className="ab-depth-1 mt-3 space-y-1.5 text-sm text-slate-300">
                                            {c.items.map((it) => (
                                                <li key={it}>{it}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </TiltCard>
                            ))}
                        </Reveal>
                    </div>

                    {/* ================= Stats ================= */}
                    <div
                        ref={statRef}
                        className={`ab-reveal mt-24 grid grid-cols-2 gap-5 lg:grid-cols-4 ${statSeen ? "is-in" : ""}`}
                    >
                        {STATS.map((s, i) => (
                            <TiltCard key={s.label} className={`ab-stat ${i === 0 ? "ab-float" : ""}`} max={14}>
                                <div className="ab-depth-2 text-4xl font-extrabold text-yellow-400">
                                    <Counter to={s.value} suffix={s.suffix} start={statSeen} />
                                </div>
                                <div className="ab-depth-1 mt-1 text-sm font-medium text-slate-200">
                                    {s.label}
                                </div>
                            </TiltCard>
                        ))}
                    </div>

                    {/* ================= How It Works ================= */}
                    <div className="mt-24">
                        <Reveal>
                            <Heading
                                tag="How It Works"
                                title="Kharidna hua aasaan"
                                text="Bas chaar simple kadam aur aapka electrical saaman taiyaar."
                            />
                        </Reveal>

                        <Reveal className="ab-steps grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                            {STEPS.map((s, i) => (
                                <div key={s.title} className="ab-step">
                                    <div className="ab-step-badge" aria-hidden="true">
                                        {s.icon}
                                        <span className="ab-step-num">{i + 1}</span>
                                    </div>
                                    <h4 className="mt-5 text-lg font-bold text-white">{s.title}</h4>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.text}</p>
                                </div>
                            ))}
                        </Reveal>
                    </div>

                    {/* ================= FAQ ================= */}
                    <div className="mx-auto mt-24 max-w-3xl">
                        <Reveal>
                            <Heading
                                tag="FAQ"
                                title="Aksar poochhe jaane wale sawal"
                            />
                        </Reveal>

                        <Reveal className="flex flex-col gap-3">
                            {FAQS.map((f, i) => (
                                <FaqItem
                                    key={f.q}
                                    id={`faq-${i}`}
                                    q={f.q}
                                    a={f.a}
                                    open={openFaq === i}
                                    onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                                />
                            ))}
                        </Reveal>
                    </div>

                    {/* ================= CTA ================= */}
                    <Reveal className="mt-24">
                        <div className="ab-cta">
                            <h3 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                                Electrical saaman chahiye?
                            </h3>
                            <p className="mx-auto mt-3 max-w-xl text-blue-100">
                                Call ya WhatsApp karein, hum aapko sahi product aur sahi rate batayenge.
                            </p>

                            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                                <a href={`tel:${PHONE_NUMBER}`} className="ab-btn ab-btn-yellow">
                                    <span aria-hidden="true">📞</span> Call Now
                                </a>
                                <a
                                    href={WHATSAPP}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ab-btn ab-btn-green"
                                >
                                    <span aria-hidden="true">💬</span> WhatsApp
                                </a>
                                <Link
                                    to="/contact"
                                    className="ab-btn border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400/10"
                                >
                                    <span aria-hidden="true">📍</span> Visit Our Shop
                                </Link>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>
        </div>
    );
}

export default About;