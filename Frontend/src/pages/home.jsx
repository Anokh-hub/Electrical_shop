import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

const STORE_PERKS = [
    { icon: "⚡", title: "100% Genuine", desc: "Certified brand products & tested wiring" },
    { icon: "💰", title: "Fair Pricing", desc: "Direct market rates with bulk discounts" },
    { icon: "🛡️", title: "Safety Assured", desc: "ISI standard MCBs, switches & cables" },
    { icon: "💬", title: "Instant Support", desc: "Expert guidance via call or WhatsApp" },
];

export default function Home() {
    return (
        <div style={{ backgroundColor: "#070d1e", minHeight: "100vh", color: "#f8fafc", display: "flex", flexDirection: "column" }}>
            {/* 1. Top Navigation */}
            <Navbar />

            {/* 2. Main Hero Section */}
            <Hero />

            {/* 3. Sleek Highlights Strip (Clean & Modern) */}
            <section style={{ backgroundColor: "#070d1e", borderTop: "1px solid rgba(34, 211, 238, 0.15)", borderBottom: "1px solid rgba(34, 211, 238, 0.15)", padding: "40px 20px" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
                    {STORE_PERKS.map((item) => (
                        <div
                            key={item.title}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                                padding: "16px 20px",
                                borderRadius: "16px",
                                backgroundColor: "rgba(15, 23, 42, 0.6)",
                                border: "1px solid rgba(34, 211, 238, 0.2)",
                            }}
                        >
                            <span style={{ fontSize: "2rem", display: "grid", placeItems: "center", width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(6, 182, 212, 0.15)", border: "1px solid rgba(34, 211, 238, 0.3)" }}>
                                {item.icon}
                            </span>
                            <div>
                                <h4 style={{ margin: "0 0 4px 0", color: "#ffffff", fontSize: "1rem", fontWeight: "700" }}>
                                    {item.title}
                                </h4>
                                <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.85rem", lineHeight: "1.4" }}>
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Bottom Footer */}
            <Footer />
        </div>
    );
}