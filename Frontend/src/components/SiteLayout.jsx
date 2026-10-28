import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

/* Navbar + Footer ek hi baar; beech mein jo page route se aaye (Outlet) */
export default function SiteLayout() {
    const { pathname } = useLocation();

    // naya page khulte hi upar se shuru
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="min-h-screen bg-[#0b1530] text-white">
            <style>{`
                .rv { opacity: 0; transform: perspective(900px) rotateX(14deg) translateY(28px); transform-origin: 50% 0; transition: opacity .7s ease, transform .8s cubic-bezier(.2, .8, .2, 1); }
                .rv-in { opacity: 1; transform: none; }
                .pg-flip { animation: pg-flip 1s cubic-bezier(.2, .8, .2, 1) both; }
                @keyframes pg-flip { from { opacity: 0; transform: perspective(600px) rotateY(-160deg) scale(.6); } to { opacity: 1; transform: none; } }
                .card3d { transition: transform .3s ease, border-color .3s, background-color .3s; }
                .card3d:hover { transform: perspective(800px) rotateX(3deg) translateY(-8px); }
                @media (prefers-reduced-motion: reduce) {
                    .rv { opacity: 1; transform: none; transition: none; }
                    .pg-flip { animation: none; }
                    .card3d, .card3d:hover { transition: none; transform: none; }
                }
            `}</style>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
