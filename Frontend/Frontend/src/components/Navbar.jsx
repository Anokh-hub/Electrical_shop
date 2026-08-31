import { useState } from "react";

function Navbar() {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">

            <div className="max-w-7xl mx-auto px-6 py-4">

                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <div>
                        <h1 className="text-2xl font-bold text-blue-700">
                            ⚡ Electrical Shop
                        </h1>

                        <p className="text-xs text-gray-500">
                            Quality Electrical Solutions
                        </p>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">

                        <a href="#home">Home</a>
                        <a href="#services">Services</a>
                        <a href="#products">Products</a>
                        <a href="#about">About</a>
                        <a href="#contact">Contact</a>

                        <a
                            href="tel:+918171558382"
                            className="bg-blue-700 text-white px-5 py-2 rounded-lg"
                        >
                            Call Now
                        </a>

                    </div>

                    {/* Mobile Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-3xl"
                    >
                        {isOpen ? "✕" : "☰"}
                    </button>

                </div>

                {/* Mobile Menu */}
                {isOpen && (

                    <div className="md:hidden mt-5 flex flex-col gap-5 pb-3">

                        <a
                            href="#home"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </a>

                        <a
                            href="#services"
                            onClick={() => setIsOpen(false)}
                        >
                            Services
                        </a>

                        <a
                            href="#products"
                            onClick={() => setIsOpen(false)}
                        >
                            Products
                        </a>

                        <a
                            href="#about"
                            onClick={() => setIsOpen(false)}
                        >
                            About
                        </a>

                        <a
                            href="#contact"
                            onClick={() => setIsOpen(false)}
                        >
                            Contact
                        </a>

                        <a
                            href="tel:+918171558382"
                            className="bg-blue-700 text-white text-center px-5 py-2 rounded-lg"
                        >
                            📞 Call Now
                        </a>

                    </div>

                )}

            </div>

        </nav>
    );
}

export default Navbar;