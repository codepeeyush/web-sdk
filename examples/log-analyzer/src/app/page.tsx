"use client"
import { useCallback, useEffect } from "react";
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
    execute(
        action: "logs:getLogs",
        filters?: {
            level?: ("log" | "error" | "warn" | "info" | "debug")[];
            from?: number;
            to?: number;
            limit?: number;
            order?: "asc" | "desc";
        }
    ): Promise<string> | string;

    // Network
    execute(
        action: "network:initCapture",
        options?: {
            captureOnlyFailed?: boolean;
            maxEntries?: number;
            maskHeaderKeys?: string[];
            maskQueryParamKeys?: string[];
            maskBodyKeys?: string[];
            responseBodyMaxBytes?: number;
        }
    ): Promise<void> | void;
    execute(action: "network:stopCapture"): Promise<void> | void;
    execute(action: "network:clearEntries"): Promise<void> | void;
    execute(
        action: "network:getEntries",
        filters?: {
            from?: number;
            to?: number;
            methods?: string[];
            urlIncludes?: string;
            statusCodes?: number[];
            statusMin?: number;
            statusMax?: number;
            onlyFailed?: boolean;
            limit?: number;
            offset?: number;
            order?: "asc" | "desc";
        }
    ): Promise<string> | string;
}

interface ToolFunction {
    arguments: string;
    name: string;
}

interface ActionData {
    action: {
        tool: {
            function: ToolFunction;
        };
    };
}

export default function Home() {
    const { registerAction, unregisterAction } = useAIActions();

    const getChatbot = useCallback((): YourGPTExecutor | undefined => {
        if (typeof window === "undefined") return undefined;
        const w = window as unknown as { $yourgptChatbot?: YourGPTExecutor };
        return w.$yourgptChatbot;
    }, []);


    const captureNetwork = useCallback(async (data: unknown, action: { respond: (message: string) => void }) => {
        const actionData = data as ActionData;
        const args = actionData.action?.tool?.function?.arguments || `{}`;
        try {
            JSON.parse(args);
        } catch {
            action.respond("Error parsing arguments.");
            return;
        }

        const ygc = getChatbot();
        if (!ygc) {
            action.respond("Chatbot SDK not ready.");
            return;
        }

        await ygc.execute("logs:initCapture");
        await ygc.execute("network:initCapture", {
            captureOnlyFailed: true,
            maxEntries: 500,
            maskHeaderKeys: ["authorization", "cookie", "x-api-key"],
            maskQueryParamKeys: ["token", "api_key", "access_token"],
            maskBodyKeys: ["password", "token", "apiKey"],
            responseBodyMaxBytes: 2048,
        });
        try {
            const json = await ygc.execute("network:getEntries", {
                onlyFailed: true,
                limit: 50,
                order: "desc",
            });
            const entries = typeof json === "string" ? JSON.parse(json) : json;
            console.log("[NetworkAnalyzer] entries", entries);
            const count = Array.isArray(entries) ? entries.length : 0;
            action.respond(`Network capture initialized. Retrieved ${count} entr${count === 1 ? "y" : "ies"}.`);
        } catch (error) {
            console.warn("[NetworkAnalyzer] getEntries failed", error);
            action.respond("Network capture initialized, but fetching entries failed.");
        }
    }, [getChatbot]);

    const captureLogs = useCallback(async (data: unknown, action: { respond: (message: string) => void }) => {
        const actionData = data as ActionData;
        const args = actionData.action?.tool?.function?.arguments || `{}`;
        let parsed: {
            level?: ("log" | "error" | "warn" | "info" | "debug")[];
            from?: number;
            to?: number;
            limit?: number;
            order?: "asc" | "desc";
        } = {};
        try {
            parsed = JSON.parse(args);
        } catch {
            action.respond("Error parsing arguments.");
            return;
        }

        const ygc = getChatbot();
        if (!ygc) {
            action.respond("Chatbot SDK not ready.");
            return;
        }

        await ygc.execute("logs:initCapture");

        try {
            const json = await ygc.execute("logs:getLogs", {
                level: parsed.level ?? ["error", "warn"],
                from: parsed.from ?? Date.now() - 5 * 60 * 1000,
                to: parsed.to ?? Date.now(),
                limit: parsed.limit ?? 100,
                order: parsed.order ?? "desc",
            });
            const logs = typeof json === "string" ? JSON.parse(json) : json;
            const count = Array.isArray(logs) ? logs.length : 0;
            console.log("[LogsAnalyzer] logs", logs);
            action.respond(`Logs capture initialized. Retrieved ${count} log${count === 1 ? "" : "s"}.`);
        } catch {
            action.respond("Logs capture initialized, but fetching logs failed.");
        }
    }, [getChatbot]);

    useEffect(() => {
        registerAction("capture_network", captureNetwork);
        registerAction("capture_logs", captureLogs);

        return () => {
            unregisterAction("capture_network");
            unregisterAction("capture_logs");
        };
    }, []);

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