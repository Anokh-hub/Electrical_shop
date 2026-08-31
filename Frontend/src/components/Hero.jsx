import Main from "../assets/images/Main.jpeg";

function Hero() {
    return (
        <section
            id="home"
            className="relative min-h-[600px] flex items-center bg-cover bg-center"
            style={{
                backgroundImage: `url(${Main})`,
            }}
        >

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-6 w-full">

                <div className="max-w-3xl">

                    <p className="text-white font-semibold mb-3">
                        ⚡ Trusted Electrical Store
                    </p>

                    <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                        Quality Electrical
                        <span className="text-blue-400">
                            {" "}Products & Services
                        </span>
                    </h1>

                    <p className="text-gray-200 text-lg mt-6 max-w-2xl">
                        All your electrical wiring, switches, lights and electrical
                        accessories under one roof. Quality products at reasonable prices.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-8">

                        {/* Call */}
                        <a
                            href="tel:+918052539606"
                            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800"
                        >
                            📞 Call Now
                        </a>

                        {/* WhatsApp */}
                        <a
                            href="https://wa.me/918052539606"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700"
                        >
                            💬 WhatsApp
                        </a>

                        {/* Directions */}
                        <a
                            href="https://www.google.com/maps/dir/?api=1&destination=25.76341,83.18535"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800"
                        >
                            📍 Get Directions
                        </a>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Hero;