function About() {
    return (
        <section id="about" className="py-20 bg-white">

            <div className="max-w-7xl mx-auto px-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Left Side */}
                    <div>

                        <p className="text-blue-700 font-semibold">
                            ABOUT OUR SHOP
                        </p>

                        <h2 className="text-4xl font-bold text-gray-900 mt-2">
                            Your Trusted Electrical Partner
                        </h2>

                        <p className="text-gray-600 mt-6 leading-relaxed">
                            We provide quality electrical products and reliable
                            electrical solutions for homes, shops and offices.
                            Our goal is to provide genuine products at reasonable
                            prices with friendly customer service.
                        </p>

                        <p className="text-gray-600 mt-4 leading-relaxed">
                            From electrical wiring and switches to LED lights,
                            MCBs and other accessories, we provide a wide range
                            of products under one roof.
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-5 mt-8">

                            <div className="flex items-center gap-3">
                                <span className="text-2xl">✓</span>
                                <span className="font-semibold">
                                    Quality Products
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-2xl">✓</span>
                                <span className="font-semibold">
                                    Reasonable Prices
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-2xl">✓</span>
                                <span className="font-semibold">
                                    Trusted Service
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-2xl">✓</span>
                                <span className="font-semibold">
                                    Customer Support
                                </span>
                            </div>

                        </div>

                    </div>

                    {/* Right Side */}
                    <div className="bg-gray-100 rounded-2xl p-10">

                        <div className="text-center">

                            <div className="text-6xl mb-5">
                                ⚡
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900">
                                Electrical Solutions
                            </h3>

                            <p className="text-gray-600 mt-4">
                                Everything you need for your electrical
                                requirements in one place.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mt-8">

                                <div className="bg-white p-5 rounded-xl">
                                    <h4 className="text-3xl font-bold text-blue-700">
                                        100+
                                    </h4>
                                    <p className="text-gray-600 mt-1">
                                        Products
                                    </p>
                                </div>

                                <div className="bg-white p-5 rounded-xl">
                                    <h4 className="text-3xl font-bold text-blue-700">
                                        1000+
                                    </h4>
                                    <p className="text-gray-600 mt-1">
                                        Customers
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default About;