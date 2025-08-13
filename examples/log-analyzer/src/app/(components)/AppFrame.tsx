"use client"

import { useState } from "react";
import { motion } from "motion/react";
import Navbar from "./Navbar";
import { YourGPTWidget } from "@yourgpt/widget-web-sdk/react";

export default function AppFrame({ children }: { children: React.ReactNode }) {
    const [isWidgetOpen, setIsWidgetOpen] = useState<boolean>(false);

    return (
        <main className="flex min-h-screen pt-16">
            <div className="flex-1">
                <Navbar
                    isWidgetOpen={isWidgetOpen}
                    onToggleWidget={() => setIsWidgetOpen((prev) => !prev)}
                />
                {children}
            </div>

            {/* AI Widget Sidebar */}
            <motion.div
                animate={{ width: isWidgetOpen ? "420px" : "0px", opacity: isWidgetOpen ? 1 : 0 }}
                className={`overflow-hidden ${isWidgetOpen ? "border-l" : ""} shrink-0 sticky top-16 h-[calc(100vh-4rem)]`}
            >
                <div className="min-w-[360px] h-full">
                    <YourGPTWidget />
                </div>
            </motion.div>
        </main>
    );
}


