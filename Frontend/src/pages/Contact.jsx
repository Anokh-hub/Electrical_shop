import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar"; // <-- Navbar import kiya

const PHONE_NUMBER = "+918052539606";
const PHONE_LABEL = "+91 8052539606";
const WHATSAPP = "https://wa.me/918052539606";
const ADDRESS_LINES = ["Q57P+845, Parmanpur, Maulanipur", "Uttar Pradesh 276123"];
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
    "Q57P+845, Parmanpur, Maulanipur, Uttar Pradesh 276123"
)}&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Q57P+845, Parmanpur, Maulanipur, Uttar Pradesh 276123"
)}`;

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

/* ---------- 3D tilt + glare card ---------- */
function TiltCard({ children, className = "", max = 8 }) {
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
            className={`ct-tilt ${className}`}
        >
            {children}
            <span className="ct-glare" aria-hidden="true" />
        </div>
    );
}

/* ---------- Ek contact row (icon + title + content) ---------- */
function InfoCard({ icon, title, children }) {
    return (
        <TiltCard className="ct-card">
            <div className="flex items-start gap-4">
                <div className="ct-icon-wrap ct-depth-2" aria-hidden="true">
                    <span className="ct-icon">{icon}</span>
                </div>
                <div className="ct-depth-1">
                    <h4 className="font-semibold text-white">{title}</h4>
                    <div className="mt-1 text-slate-300">{children}</div>
                </div>
            </div>
        </TiltCard>
    );
}

function Contact() {
    const [headRef, headSeen] = useInView();
    const [leftRef, leftSeen] = useInView();
    const [rightRef, rightSeen] = useInView();

    return (
        <div className="min-h-screen bg-[#0b1530] text-white">
            {/* Top Navigation Bar */}
            <Navbar />

            <section
                id="contact"
                className="relative overflow-hidden bg-[#0b1530] py-20 text-white"
            >
                <style>{`
                    /* ===== Background grid + glow ===== */
                    .ct-bg {
                        position: absolute; inset: 0; pointer-events: none;
                        background:
                            radial-gradient(600px circle at 85% 10%, rgba(59, 130, 246, .22), transparent 60%),
                            radial-gradient(500px circle at 10% 90%, rgba(250, 204, 21, .12), transparent 60%);
                    }
                    .ct-grid {
                        position: absolute; inset: 0; pointer-events: none; opacity: .35;
                        background-image:
                            linear-gradient(rgba(148, 163, 184, .12) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(148, 163, 184, .12) 1px, transparent 1px);
                        background-size: 44px 44px;
                        mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
                        -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
                    }

                    /* ===== Reveal ===== */
                    .ct-reveal { opacity: 0; transform: translateY(28px); transition: opacity .7s ease, transform .7s cubic-bezier(.2, .8, .2, 1); }
                    .ct-reveal.is-in { opacity: 1; transform: none; }

                    /* ===== Tilt + glare ===== */
                    .ct-tilt {
                        position: relative; transform-style: preserve-3d;
                        transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
                        transition: transform .2s ease-out; will-change: transform;
                    }
                    .ct-glare {
                        position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0;
                        background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(255, 255, 255, .2), transparent 60%);
                        transition: opacity .25s;
                    }
                    .ct-tilt:hover .ct-glare { opacity: 1; }
                    .ct-depth-1 { transform: translateZ(22px); }
                    .ct-depth-2 { transform: translateZ(42px); }

                    /* ===== Info card ===== */
                    .ct-card {
                        border-radius: 16px; padding: 20px;
                        background: linear-gradient(145deg, rgba(59, 130, 246, .22), rgba(29, 78, 216, .08));
                        border: 1px solid rgba(250, 204, 21, .35);
                        box-shadow: 0 14px 30px rgba(0, 0, 0, .35), inset 0 0 24px rgba(59, 130, 246, .14);
                    }
                    .ct-icon-wrap {
                        display: grid; place-items: center; width: 52px; height: 52px; flex-shrink: 0;
                        border-radius: 14px; background: #facc15;
                        box-shadow: 0 4px 0 #b45309, 0 10px 18px rgba(250, 204, 21, .25);
                    }
                    .ct-icon { font-size: 26px; }

                    /* ===== Extruded buttons ===== */
                    .ct-btn {
                        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
                        border-radius: 12px; padding: 12px 22px; font-weight: 600;
                        transition: box-shadow .15s, transform .15s, background-color .2s;
                    }
                    .ct-btn:focus-visible { outline: 2px solid #facc15; outline-offset: 3px; }
                    .ct-btn-yellow { background: #facc15; color: #0b1530; box-shadow: 0 4px 0 #b45309, 0 12px 22px rgba(250, 204, 21, .25); }
                    .ct-btn-yellow:hover { background: #fde047; }
                    .ct-btn-yellow:active { transform: translateY(3px); box-shadow: 0 1px 0 #b45309, 0 4px 8px rgba(250, 204, 21, .2); }
                    .ct-btn-green { background: #22c55e; color: #052e16; box-shadow: 0 4px 0 #15803d, 0 12px 22px rgba(34, 197, 94, .25); }
                    .ct-btn-green:hover { background: #4ade80; }
                    .ct-btn-green:active { transform: translateY(3px); box-shadow: 0 1px 0 #15803d, 0 4px 8px rgba(34, 197, 94, .2); }

                    /* ===== Map frame ===== */
                    .ct-map {
                        border-radius: 18px; overflow: hidden; padding: 8px;
                        background: linear-gradient(145deg, rgba(250, 204, 21, .5), rgba(59, 130, 246, .35));
                        box-shadow: 0 8px 0 rgba(250, 204, 21, .45), 0 24px 40px rgba(0, 0, 0, .45);
                    }
                    .ct-map iframe { display: block; width: 100%; height: 340px; border: 0; border-radius: 12px; background: #e5e7eb; }

                    @media (prefers-reduced-motion: reduce) {
                        .ct-reveal { opacity: 1; transform: none; transition: none; }
                        .ct-tilt, .ct-btn { transition: none; }
                    }
                `}</style>

                <div className="ct-bg" />
                <div className="ct-grid" />

                <div className="relative mx-auto max-w-7xl px-6">
                    {/* Heading */}
                    <div
                        ref={headRef}
                        className={`ct-reveal mb-12 text-center ${headSeen ? "is-in" : ""}`}
                    >
                        <p className="inline-block rounded-full border border-yellow-400/50 bg-yellow-400/10 px-4 py-1 text-sm font-semibold text-yellow-400">
                            Get In Touch
                        </p>
                        <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                            Contact Us
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-slate-300">
                            Have a question or need an electrical product? Get in touch with us.
                        </p>
                    </div>

                    {/* Contact Content */}
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                        {/* Left - Contact Details */}
                        <div
                            ref={leftRef}
                            className={`ct-reveal flex flex-col gap-5 ${leftSeen ? "is-in" : ""}`}
                        >
                            <h3 className="text-2xl font-bold text-white">Let's Talk</h3>

                            <InfoCard icon="📞" title="Phone">
                                <a
                                    href={`tel:${PHONE_NUMBER}`}
                                    className="text-yellow-400 hover:underline"
                                >
                                    {PHONE_LABEL}
                                </a>
                            </InfoCard>

                            <InfoCard icon="💬" title="WhatsApp">
                                <a
                                    href={WHATSAPP}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-yellow-400 hover:underline"
                                >
                                    Chat with us
                                </a>
                            </InfoCard>

                            <InfoCard icon="📍" title="Address">
                                <p>
                                    {ADDRESS_LINES[0]}
                                    <br />
                                    {ADDRESS_LINES[1]}
                                </p>
                            </InfoCard>
                        </div>

                        {/* Right - Map + quick buttons */}
                        <div
                            ref={rightRef}
                            className={`ct-reveal flex flex-col gap-6 ${rightSeen ? "is-in" : ""}`}
                        >
                            <TiltCard className="ct-map" max={6}>
                                <iframe
                                    title="Electrical Shop location on Google Maps"
                                    src={MAP_SRC}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    allowFullScreen
                                />
                            </TiltCard>

                            <div className="flex flex-wrap gap-4">
                                <a href={`tel:${PHONE_NUMBER}`} className="ct-btn ct-btn-yellow">
                                    <span aria-hidden="true">📞</span> Call Now
                                </a>
                                <a
                                    href={WHATSAPP}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ct-btn ct-btn-green"
                                >
                                    <span aria-hidden="true">💬</span> WhatsApp
                                </a>
                                <a
                                    href={MAP_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ct-btn border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                                >
                                    <span aria-hidden="true">🧭</span> Get Directions
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;