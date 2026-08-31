import product1 from "../assets/images/product1.jpeg";
import cables_wires from "../assets/images/cables_wires.jpeg";
import MCB from "../assets/images/MCB.jpeg";
import switch_sockets from "../assets/images/switch_sockets.jpeg";
import shop from "../assets/images/shop.jpeg";

function Products() {
    const products = [
        {
            name: "Electrical Wires",
            description:
                "High-quality wires for safe and reliable electrical connections.",
            image: cables_wires,
        },
        {
            name: "LED Lights",
            description:
                "Energy-efficient LED bulbs, panels and lighting solutions.",
            image: product1,
        },
        {
            name: "Switches & Sockets",
            description:
                "Durable switches and sockets for homes and offices.",
            image: switch_sockets,
        },
        {
            name: "MCB & DB Boxes",
            description:
                "Reliable electrical protection and distribution products.",
            image: MCB,
        },
        {
            name: "Fans",
            description:
                "Quality ceiling and electrical fans for your home.",
            image: product1,
        },
        {
            name: "Electrical Accessories",
            description:
                "Plugs, holders, connectors and other electrical accessories.",
            image: shop,
        },
    ];

    return (
        <section id="products" className="py-20 bg-gray-50">

            <div className="max-w-7xl mx-auto px-6">

                {/* Heading */}
                <div className="text-center mb-12">

                    <p className="text-blue-700 font-semibold">
                        OUR PRODUCTS
                    </p>

                    <h2 className="text-4xl font-bold text-gray-900 mt-2">
                        Quality Electrical Products
                    </h2>

                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        We offer a wide range of electrical products
                        for homes, shops and offices.
                    </p>

                </div>

                {/* Products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {products.map((product, index) => (

                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition duration-300"
                        >

                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-48 object-cover rounded-lg mb-5"
                                />
                            ) : (
                                <div
                                    className="text-5xl mb-5"
                                    aria-hidden="true"
                                >
                                    {product.icon}
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-gray-900">
                                {product.name}
                            </h3>

                            <p className="text-gray-600 mt-3">
                                {product.description}
                            </p>

                            <button className="mt-5 text-blue-700 font-semibold hover:text-blue-900">
                                View Details →
                            </button>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
}

export default Products;