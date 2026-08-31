function Services() {
    const services = [
        {
            title: "Electrical Wiring",
            description:
                "Complete house, shop and office electrical wiring solutions.",
            icon: "⚡",
        },
        {
            title: "LED Lighting",
            description:
                "LED bulbs, panels, decorative lights and lighting solutions.",
            icon: "💡",
        },
        {
            title: "Switches & Sockets",
            description:
                "Quality switches, sockets and electrical accessories.",
            icon: "🔌",
        },
        {
            title: "MCB & Distribution",
            description:
                "MCB, DB boxes and electrical protection solutions.",
            icon: "🛡️",
        },
    ];

    return (
        <section id="services" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                {/* Heading */}
                <div className="text-center mb-12">
                    <p className="text-blue-700 font-semibold">
                        WHAT WE OFFER
                    </p>

                    <h2 className="text-4xl font-bold text-gray-900 mt-2">
                        Our Services
                    </h2>

                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        We provide reliable electrical products and solutions
                        for homes, shops and offices.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="p-6 border border-gray-200 rounded-xl hover:shadow-lg hover:-translate-y-1 transition duration-300"
                        >
                            <div className="text-4xl mb-4">
                                {service.icon}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900">
                                {service.title}
                            </h3>

                            <p className="text-gray-600 mt-3">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default Services;