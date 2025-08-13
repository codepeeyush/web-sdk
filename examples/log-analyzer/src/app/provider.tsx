"use client";

import { useAIActions, YourGPTProvider } from "@yourgpt/widget-web-sdk/react";
import { WidgetRenderModeE } from "@yourgpt/widget-web-sdk";
import { useCallback, useEffect } from "react";


interface YourGPTChatbotT {
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

export function Provider({ children }: { children: React.ReactNode }) {
  const { registerAction, unregisterAction } = useAIActions();

  const captureNetwork = useCallback(async (data: unknown, action: { respond: (message: string) => void }) => {
    const actionData = data as ActionData;
    const args = actionData.action?.tool?.function?.arguments || `{}`;
    try {
      JSON.parse(args);
    } catch {
      action.respond("Error parsing arguments.");
      return;
    }

    const chatbot = typeof window !== "undefined"
      ? (window as unknown as { $yourgptChatbot?: YourGPTChatbotT }).$yourgptChatbot
      : undefined;

    if (!chatbot) {
      action.respond("Chatbot SDK not ready.");
      return;
    }

    try {
      const json = await chatbot.execute("network:getEntries", {
        onlyFailed: true,
        methods: ["GET", "POST"],
        urlIncludes: "/api",
        statusMin: 400,
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
  }, []);

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

    const chatbot = typeof window !== "undefined"
      ? (window as unknown as { $yourgptChatbot?: YourGPTChatbotT }).$yourgptChatbot
      : undefined;

    if (!chatbot) {
      action.respond("Chatbot SDK not ready.");
      return;
    }

    try {
      const json = await chatbot.execute("logs:getLogs", {
        level: parsed.level ?? ["error", "warn"], // default useful filter
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
  }, []);

  useEffect(() => {
    setTimeout(async () => {
      const chatbot = typeof window !== "undefined"
        ? (window as unknown as { $yourgptChatbot?: YourGPTChatbotT }).$yourgptChatbot
        : undefined;

      if (!chatbot) return;

      // Initialize network capture
      chatbot.execute("network:initCapture", {
        captureOnlyFailed: true,
        maxEntries: 500,
        maskHeaderKeys: ["authorization", "cookie", "x-api-key"],
        maskQueryParamKeys: ["token", "api_key", "access_token"],
        maskBodyKeys: ["password", "token", "apiKey"],
        responseBodyMaxBytes: 2048,
      });
      console.log("Initializing network capture...");

      // Initialize logs capture
      chatbot.execute("logs:initCapture");
      console.log("Initializing logs capture...");
    }, 2000);
  }, []);

  useEffect(() => {
    registerAction("capture_network", captureNetwork);
    registerAction("capture_logs", captureLogs);

    return () => {
      unregisterAction("capture_network");
      unregisterAction("capture_logs");
    };
  }, [registerAction, unregisterAction, captureNetwork, captureLogs]);
  return (
    <YourGPTProvider
      onError={(error) => {
        console.error("SDFK <ERRRR", error);
      }}
      config={{
        widgetId: process.env.NEXT_PUBLIC_WIDGET_UID!,
        endpoint: process.env.NEXT_PUBLIC_WIDGET_ENDPOINT!,
        mode: WidgetRenderModeE.embedded,
      }}
    >
      {children}
    </YourGPTProvider>
  );
}
