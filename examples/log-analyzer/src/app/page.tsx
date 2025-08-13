"use client"
import CTA from "./(components)/CTA";
import Footer from "./(components)/Footer";
import Hero from "./(components)/Hero";
import Services from "./(components)/Services";
import Testimonials from "./(components)/Testimonials";
import { useAIActions } from "@yourgpt/widget-web-sdk/react";

interface YourGPTExecutor {
    // Logs
    execute(action: "logs:initCapture"): Promise<void> | void;
    execute(action: "logs:stopCapture"): Promise<void> | void;
    execute(action: "logs:clearLogs"): Promise<void> | void;

    // Network
    execute(action: "network:initCapture"): Promise<void> | void;
    execute(action: "network:stopCapture"): Promise<void> | void;
    execute(action: "network:clearEntries"): Promise<void> | void;
}

const getChatbot = (): YourGPTExecutor | undefined => {
    if (typeof window === "undefined") return undefined;
    const w = window as unknown as { $yourgptChatbot?: YourGPTExecutor };
    return w.$yourgptChatbot;
};

const initCapture = async () => {
    const ygc = getChatbot();
    if (!ygc) return;
    await ygc.execute("logs:initCapture");
    await ygc.execute("network:initCapture");
}

const stopCapture = async () => {
    const ygc = getChatbot();
    if (!ygc) return;
    await ygc.execute("logs:stopCapture");
    await ygc.execute("network:stopCapture");
}

const clearCaptures = async () => {
    const ygc = getChatbot();
    if (!ygc) return;
    await ygc.execute("logs:clearLogs");
    await ygc.execute("network:clearEntries");
}


export default function Home() {
    const aiActions = useAIActions();

    

    return (
        <>
            <Hero />
            <Services />
            <Testimonials />
            <CTA />
            <Footer />
        </>
    );
}