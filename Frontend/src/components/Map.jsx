function Map() {
    return (
        <section id="location" className="py-20 bg-white">

            <div className="max-w-7xl mx-auto px-6">

                {/* Heading */}
                <div className="text-center mb-10">

                    <p className="text-blue-700 font-semibold">
                        FIND US
                    </p>

                    <h2 className="text-4xl font-bold text-gray-900 mt-2">
                        Visit Our Shop
                    </h2>

                    <p className="text-gray-600 mt-4">
                        We are happy to serve you. Visit our shop for
                        quality electrical products.
                    </p>

                </div>

                {/* Map + Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">



                    {/* Location Details */}
                    <div className="bg-gray-50 rounded-2xl p-8">

                        <h3 className="text-2xl font-bold text-gray-900">
                            Shop Location
                        </h3>

                        <div className="mt-6 space-y-6">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Address
                                </p>

                                <p className="font-semibold text-gray-900 mt-1">
                                    Q57P+845, Parmanpur, Maulanipur<br />
                                    Uttar Pradesh 276123
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Opening Hours
                                </p>

                                <p className="font-semibold text-gray-900 mt-1">
                                    Monday - Sunday
                                </p>

                                <p className="text-gray-600">
                                    9:00 AM - 8:00 PM
                                </p>
                            </div>

                            <a
                                href="https://www.google.com/maps/dir/?api=1&destination=25.76341,83.18535"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-center bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                            >
                                📍 Get Directions
                            </a>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Map;