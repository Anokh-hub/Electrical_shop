function Footer() {
    return (
        <footer className="bg-gray-900 text-white">

            <div className="max-w-7xl mx-auto px-6 py-12">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Shop Info */}
                    <div>
                        <h2 className="text-2xl font-bold text-blue-400">
                            ⚡ Electrical Shop
                        </h2>

                        <p className="text-gray-400 mt-4 leading-relaxed">
                            Quality electrical products and reliable
                            electrical solutions for homes, shops and offices.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold">
                            Quick Links
                        </h3>

                        <div className="flex flex-col gap-3 mt-4">

                            <a
                                href="#home"
                                className="text-gray-400 hover:text-white"
                            >
                                Home
                            </a>

                            <a
                                href="#services"
                                className="text-gray-400 hover:text-white"
                            >
                                Services
                            </a>

                            <a
                                href="#products"
                                className="text-gray-400 hover:text-white"
                            >
                                Products
                            </a>

                            <a
                                href="#about"
                                className="text-gray-400 hover:text-white"
                            >
                                About
                            </a>

                            <a
                                href="#contact"
                                className="text-gray-400 hover:text-white"
                            >
                                Contact
                            </a>

                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold">
                            Contact Us
                        </h3>

                        <div className="mt-4 space-y-3">

                            <p className="text-gray-400">
                                📞 +91 8052539609
                            </p>

                            <p className="text-gray-400">
                                📍Q57P+845, Parmanpur, Maulanipur<br />
                                Uttar Pradesh 276123
                            </p>

                            <p className="text-gray-400">
                                🕐 9:00 AM - 8:00 PM
                            </p>

                        </div>
                    </div>

                </div>

                {/* Bottom */}
                <div className="border-t border-gray-700 mt-10 pt-6 text-center">

                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Electrical Shop.
                        All rights reserved.
                    </p>

                </div>

            </div>

        </footer>
    );
}

export default Footer;