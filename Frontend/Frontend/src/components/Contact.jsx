function Contact() {
    return (
        <section id="contact" className="py-20 bg-gray-50">

            <div className="max-w-7xl mx-auto px-6">

                {/* Heading */}
                <div className="text-center mb-12">

                    <p className="text-blue-700 font-semibold">
                        GET IN TOUCH
                    </p>

                    <h2 className="text-4xl font-bold text-gray-900 mt-2">
                        Contact Us
                    </h2>

                    <p className="text-gray-600 mt-4">
                        Have a question or need an electrical product?
                        Get in touch with us.
                    </p>

                </div>

                {/* Contact Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* Left - Contact Details */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm">

                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            Let's Talk
                        </h3>

                        {/* Phone */}
                        <div className="flex items-start gap-4 mb-6">

                            <div className="text-3xl">
                                📞
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900">
                                    Phone
                                </h4>

                                <a
                                    href="tel:+918052539606"
                                    className="text-blue-700 hover:underline"
                                >
                                    +91 8052539606
                                </a>
                            </div>

                        </div>

                        {/* WhatsApp */}
                        <div className="flex items-start gap-4 mb-6">

                            <div className="text-3xl">
                                💬
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900">
                                    WhatsApp
                                </h4>

                                <a
                                    href="https://wa.me/918052539606"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-700 hover:underline"
                                >
                                    Chat with us
                                </a>
                            </div>

                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-4">

                            <div className="text-3xl">
                                📍
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900">
                                    Address
                                </h4>

                                <p className="text-gray-600">
                                    Q57P+845, Parmanpur, Maulanipur<br />
                                    Uttar Pradesh 276123
                                </p>
                            </div>

                        </div>

                    </div>


                </div>

            </div>

        </section>
    );
}

export default Contact;