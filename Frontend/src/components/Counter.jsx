import { useEffect, useRef, useState } from "react";

/* Screen par aate hi 0 se target tak ginti */
export default function Counter({ to, suffix = "" }) {
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