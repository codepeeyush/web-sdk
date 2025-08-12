import Contact from "./(components)/Contact";
import Footer from "./(components)/Footer";
import Hero from "./(components)/Hero";
import Navbar from "./(components)/Navbar";
import Services from "./(components)/Services";
import Testimonials from "./(components)/Testimonials";

export default function Home() {
    return (
        <main>
            <Navbar />
            <Hero />
            <Services />
            <Testimonials />
            <Contact />
            <Footer />
        </main>
    );
}