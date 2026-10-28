import { Link } from "react-router-dom";

export default function PageHeader({ icon, title, text }) {
    return (
        <header className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#14275a] to-[#0b1530]">
            <div
                className="absolute inset-0 opacity-70"
                aria-hidden="true"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(250,204,21,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(250,204,21,.07) 1px, transparent 1px)",
                    backgroundSize: "52px 52px",
                    WebkitMaskImage: "radial-gradient(ellipse at 20% 50%, #000 15%, transparent 75%)",
                    maskImage: "radial-gradient(ellipse at 20% 50%, #000 15%, transparent 75%)",
                }}
            />
            <div className="relative mx-auto max-w-7xl px-6 py-14 md:py-20">
                <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
                    <Link to="/" className="hover:text-yellow-400">Home</Link>
                    <span className="mx-2">/</span>
                    <span className="text-yellow-300">{title}</span>
                </nav>

                <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="pg-flip flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-3xl shadow-xl shadow-yellow-400/25">
                        {icon}
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">{title}</h1>
                        <p className="mt-3 max-w-2xl text-lg text-slate-300">{text}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
