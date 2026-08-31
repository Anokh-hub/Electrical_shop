import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Products from "../components/Products";
import About from "../components/About";
import Contact from "../components/Contact";
import Map from "../components/Map";
import Footer from "../components/Footer";

function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <Products />
            <Services />
            <Contact />
            <About />
            <Map />
            <Footer />
        </>
    );
}

export default Home;