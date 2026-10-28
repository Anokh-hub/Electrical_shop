/* ========= EDIT: apni shop ki asli details yahan daalo ========= */
export const SHOP = {
    name: "Electrical Shop",
    tagline: "Quality Electrical Solutions",
    phone: "+918052539606", // call number (tel: link)
    phoneDisplay: "+91 80525 39606",
    whatsapp: "918052539606", // WhatsApp number, bina + ke
    address: "Add your shop address here",
    hours: "Mon – Sat, 9:00 AM – 8:00 PM",
    lat: 25.76341,
    lng: 83.18535,
};

/* Placeholder numbers: apne asli figures se badlo ya hata do */
export const STATS = [
    { value: 5000, suffix: "+", label: "Products in stock" },
    { value: 1000, suffix: "+", label: "Happy customers" },
    { value: 10, suffix: "+", label: "Years of trust" },
    { value: 100, suffix: "%", label: "Genuine products" },
];

export const waLink = (text = "") =>
    `https://wa.me/${SHOP.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const mapDirections = `https://www.google.com/maps/dir/?api=1&destination=${SHOP.lat},${SHOP.lng}`;
export const mapEmbed = `https://www.google.com/maps?q=${SHOP.lat},${SHOP.lng}&z=16&output=embed`;

export const SERVICES = [
    {
        icon: "🏠", title: "Home Wiring",
        short: "Safe, neat wiring for new houses and renovations.",
        details: "We plan and lay concealed and surface wiring so every room has the points it needs, with proper load balancing and earthing.",
        bullets: ["New house and flat wiring", "Rewiring of old houses", "Concealed and surface conduit work", "Extra points, sockets and switchboards"],
    },
    {
        icon: "🏪", title: "Shop & Office Wiring",
        short: "Reliable electrical setup for shops, offices and workshops.",
        details: "Lighting, power points and distribution boards sized for your equipment, so your business keeps running without trips or overheating.",
        bullets: ["Counter, display and signage lighting", "Power points for computers and machines", "Distribution board (DB) setup", "Three-phase wiring"],
    },
    {
        icon: "💡", title: "Light & Fan Fitting",
        short: "Installation of lights, fans and decorative fixtures.",
        details: "From a single tube light to full decorative lighting, we fit everything securely and test it before we leave.",
        bullets: ["Ceiling and exhaust fans", "LED panels, tube lights and bulbs", "Chandeliers and decorative lights", "Outdoor and garden lighting"],
    },
    {
        icon: "🛡️", title: "MCB & Safety Fitting",
        short: "Protect your home from overload and short circuits.",
        details: "Proper protection devices and earthing keep your family and your appliances safe from electrical faults.",
        bullets: ["MCB, RCCB and DB box fitting", "Earthing installation", "Overload and short-circuit protection", "Safety check of existing wiring"],
    },
    {
        icon: "🔧", title: "Repair & Fault Finding",
        short: "Quick help when a switch, line or appliance stops working.",
        details: "We trace the real cause of the problem instead of just patching it, so it does not come back next week.",
        bullets: ["Tripping and short-circuit faults", "Loose or damaged wiring", "Switch, socket and board replacement", "Flickering lights and voltage issues"],
    },
    {
        icon: "🧰", title: "Product Advice",
        short: "Not sure what to buy? We help you pick the right item.",
        details: "Tell us your load and budget and we will suggest the right product, with no pressure to buy the most expensive one.",
        bullets: ["Right wire size for your load", "Quality vs budget options", "Bulk orders for builders and contractors", "Replacements and compatible parts"],
    },
];

export const PRODUCT_CATEGORIES = [
    { id: "wiring", icon: "🔌", title: "Wiring & Cables", short: "Everything to carry power safely through your building.", items: ["House wires", "Flexible cables", "Conduit pipes and fittings", "Cable ties and clips", "Junction boxes"] },
    { id: "switches", icon: "🎛️", title: "Switches & Sockets", short: "Modular switches and sockets for every room.", items: ["Modular switches", "Sockets and plates", "Fan regulators", "Dimmers", "Bells and indicators"] },
    { id: "lighting", icon: "💡", title: "LED & Lighting", short: "Energy-saving lights for home, shop and outdoors.", items: ["LED bulbs", "Tube lights and battens", "Panel lights", "Decorative and strip lights", "Outdoor lights"] },
    { id: "fans", icon: "🌀", title: "Fans", short: "Keep every room cool and well ventilated.", items: ["Ceiling fans", "Exhaust fans", "Table and wall fans", "Regulators", "Capacitors"] },
    { id: "protection", icon: "🛡️", title: "MCB & Protection", short: "Safety gear that guards against overload and shocks.", items: ["MCBs and RCCBs", "DB boxes", "Fuses and holders", "Earthing kits", "Surge protectors"] },
    { id: "tools", icon: "🧰", title: "Tools & Accessories", short: "Small things that every electrical job needs.", items: ["Testers and multimeters", "Insulation tape", "Screwdriver sets", "Extension boards", "Plugs and adaptors"] },
];

export const VALUES = [
    { icon: "✅", title: "Genuine products", text: "We sell quality items that are built to last, so you do not pay twice." },
    { icon: "💰", title: "Fair prices", text: "Reasonable rates with no hidden charges, whether you buy one switch or a full house set." },
    { icon: "🤝", title: "Honest advice", text: "We tell you what you actually need, not what is most expensive." },
];

export const STEPS = [
    { title: "Call or visit us", text: "Tell us what you need, or send photos on WhatsApp." },
    { title: "Get a clear quote", text: "We check the work, suggest the right products and share the cost up front." },
    { title: "Work done safely", text: "The job is completed neatly and everything is tested before we leave." },
];

export const FAQS = [
    { q: "Do you do wiring for new houses and shops?", a: "Yes. We handle complete wiring for new houses, flats, shops and offices, as well as rewiring of older buildings. Call or WhatsApp us with the size of the place and we will explain the next steps." },
    { q: "Can I just buy products without taking a service?", a: "Of course. Many customers only visit for switches, wires, lights or fans. You can also ask us which product suits your need." },
    { q: "Do you give special rates on bulk orders?", a: "For builders, contractors and large orders we offer special rates. Share your requirement list on WhatsApp and we will send a quote." },
    { q: "How do I get a quote?", a: "Send photos or a short description on WhatsApp, or visit the shop. We will tell you the products needed and the approximate cost before any work begins." },
    { q: "My power keeps tripping. What should I do?", a: "Switch off the supply to the affected line and call us. Frequent tripping usually points to an overload, a short circuit or damaged wiring, and it should be checked before it gets worse." },
];