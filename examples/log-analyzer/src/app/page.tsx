"use client"
import { useState } from "react";
import { motion } from "motion/react";
import CTA from "./(components)/CTA";
import Footer from "./(components)/Footer";
import Hero from "./(components)/Hero";
import Navbar from "./(components)/Navbar";
import Services from "./(components)/Services";
import Testimonials from "./(components)/Testimonials";
import { YourGPTWidget } from "@yourgpt/widget-web-sdk/react";

export default function Home() {
    const [isWidgetOpen, setIsWidgetOpen] = useState<boolean>(true);

    return (
        <main className="flex min-h-screen pt-16">
            <div className="flex-1">
                <Navbar
                    isWidgetOpen={isWidgetOpen}
                    onToggleWidget={() => setIsWidgetOpen((prev) => !prev)}
                />
                <Hero />
                <Services />
                <Testimonials />
                <CTA />
                <Footer />
            </div>

            {/* AI Widget Sidebar */}
            <div className="shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
                <motion.div
                    animate={{ width: isWidgetOpen ? "420px" : "0px", opacity: isWidgetOpen ? 1 : 0 }}
                    className={`h-full overflow-hidden ${isWidgetOpen ? "border-l" : ""}`}
                >
                    <div className="min-w-[360px] h-full">
                        <YourGPTWidget />
                    </div>
                </motion.div>
            </div>
        </main>
    );
}