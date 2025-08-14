"use client"
import CTA from "./(components)/CTA";
import Hero from "./(components)/Hero";
import Services from "./(components)/Services";
import Testimonials from "./(components)/Testimonials";

export default function Home() {
    return (
        <>
            <Hero />
            <Services />
            <Testimonials />
            <CTA />
        </>
    );
}