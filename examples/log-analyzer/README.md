# Log and Network Analyzer (AstroHost Example)

This example demonstrates integrating the YourGPT Widget SDK in a Next.js app to analyze application network traffic and console logs. It embeds the AI widget, registers domain-specific AI actions, and provides a simple hosting dashboard UI (AstroHost) with instance management.

## Prerequisites

- Node.js 18+ and npm
- A YourGPT Widget configured in your YourGPT dashboard
- Environment variables for the widget (see Setup)

## YourGPT Widget Integration

📦 Installation

```bash
npm install @yourgpt/widget-web-sdk
```

🔧 Setup

1) Provide the YourGPT provider at the app root and embed the widget sidebar:

```typescript
// src/app/layout.tsx
import { Provider } from "./provider";
// ...
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          {/* App frame renders the embedded <YourGPTWidget /> */}
          {/* ... */}
        </Provider>
      </body>
    </html>
  );
}
```

```typescript
// src/app/(components)/AppFrame.tsx
import { YourGPTWidget } from "@yourgpt/widget-web-sdk/react";
// ...
<div className="min-w-[360px] h-full">
  <YourGPTWidget />
  {/* The widget appears in a collapsible sidebar */}
  {/* Toggled via the top Navbar */}
  {/* ... */}
</div>
```

2) Configure the provider and register AI actions in `src/app/provider.tsx`:

```typescript
import { useAIActions, YourGPTProvider } from "@yourgpt/widget-web-sdk/react";
import { WidgetRenderModeE } from "@yourgpt/widget-web-sdk";

export function Provider({ children }: { children: React.ReactNode }) {
  const { registerAction, unregisterAction } = useAIActions();

  // Register actions that the AI can call
  useEffect(() => {
    registerAction("capture_network", captureNetwork);
    registerAction("capture_logs", captureLogs);
    return () => {
      unregisterAction("capture_network");
      unregisterAction("capture_logs");
    };
  }, [registerAction, unregisterAction]);

  return (
    <YourGPTProvider
      config={{
        widgetId: process.env.NEXT_PUBLIC_WIDGET_UID!,
        mode: WidgetRenderModeE.embedded,
      }}
    >
      {children}
    </YourGPTProvider>
  );
}
```

3) Environment variables

Create `.env.local` in this example folder and set:

```bash
NEXT_PUBLIC_WIDGET_UID=your-widget-id
```

## AI Actions

This app exposes two AI actions to YourGPT via `useAIActions()`:

### capture_network

#### Function

- Purpose: Query and summarize captured network entries (useful for spotting failing API calls).
- Parameters (implicit defaults inside implementation):
  - `onlyFailed`: boolean (default: true)
  - `methods`: string[] (default: ["GET", "POST"])
  - `urlIncludes`: string (default: "/api")
  - `statusMin`: number (default: 400)
  - `limit`: number (default: 50)
  - `order`: "asc" | "desc" (default: "desc")
- Returns: Brief message with count of entries retrieved.

#### Implementation

```typescript
// src/app/provider.tsx (excerpt)
const captureNetwork = useCallback(async (data: unknown, action: { respond: (message: string) => void }) => {
  const chatbot = typeof window !== "undefined"
    ? (window as unknown as { $yourgptChatbot?: YourGPTChatbotT }).$yourgptChatbot
    : undefined;
  if (!chatbot) {
    action.respond("Chatbot SDK not ready.");
    return;
  }

  const json = await chatbot.execute("network:getEntries", {
    onlyFailed: true,
    methods: ["GET", "POST"],
    urlIncludes: "/api",
    statusMin: 400,
    limit: 50,
    order: "desc",
  });
  const entries = typeof json === "string" ? JSON.parse(json) : json;
  const count = Array.isArray(entries) ? entries.length : 0;
  action.respond(`Network capture initialized. Retrieved ${count} entr${count === 1 ? "y" : "ies"}.`);
}, []);
```

Auto-initialization at startup:

```typescript
// Network capture boot config (masked sensitive fields)
chatbot.execute("network:initCapture", {
  captureOnlyFailed: true,
  maxEntries: 500,
  maskHeaderKeys: ["authorization", "cookie", "x-api-key"],
  maskQueryParamKeys: ["token", "api_key", "access_token"],
  maskBodyKeys: ["password", "token", "apiKey"],
  responseBodyMaxBytes: 2048,
});
```

### capture_logs

#### Function

- Purpose: Retrieve and summarize recent console logs captured on the page.
- Parameters (all optional, with defaults applied inside implementation):
  - `level`: ("log" | "error" | "warn" | "info" | "debug")[] — default: ["error", "warn"]
  - `from`: number (epoch ms) — default: now - 5 minutes
  - `to`: number (epoch ms) — default: now
  - `limit`: number — default: 100
  - `order`: "asc" | "desc" — default: "desc"
- Returns: Brief message with count of logs retrieved.

#### Implementation

```typescript
// src/app/provider.tsx (excerpt)
const captureLogs = useCallback(async (data: unknown, action: { respond: (message: string) => void }) => {
  const actionData = data as ActionData;
  const args = actionData.action?.tool?.function?.arguments || `{}`;
  let parsed: { level?: ("log" | "error" | "warn" | "info" | "debug")[]; from?: number; to?: number; limit?: number; order?: "asc" | "desc" } = {};
  try { parsed = JSON.parse(args); } catch { action.respond("Error parsing arguments."); return; }

  const chatbot = typeof window !== "undefined"
    ? (window as unknown as { $yourgptChatbot?: YourGPTChatbotT }).$yourgptChatbot
    : undefined;
  if (!chatbot) { action.respond("Chatbot SDK not ready."); return; }

  const json = await chatbot.execute("logs:getLogs", {
    level: parsed.level ?? ["error", "warn"],
    from: parsed.from ?? Date.now() - 5 * 60 * 1000,
    to: parsed.to ?? Date.now(),
    limit: parsed.limit ?? 100,
    order: parsed.order ?? "desc",
  });
  const logs = typeof json === "string" ? JSON.parse(json) : json;
  const count = Array.isArray(logs) ? logs.length : 0;
  action.respond(`Logs capture initialized. Retrieved ${count} log${count === 1 ? "" : "s"}.`);
}, []);
```

Auto-initialization at startup:

```typescript
chatbot.execute("logs:initCapture");
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env.local`:

```bash
NEXT_PUBLIC_WIDGET_UID=your-widget-id
```

3. Run the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000` in your browser and toggle the widget from the Navbar.

## Features

- Embedded YourGPT widget (collapsible sidebar)
- AI actions for network and log capture with privacy masking
- Instance management dashboard (create, switch, clone, delete)
- Toast-based feedback and responsive UI

## Project Structure (key files)

- `src/app/provider.tsx` — YourGPT provider config and AI actions registration
- `src/app/(components)/AppFrame.tsx` — App shell with embedded `YourGPTWidget`
- `src/app/layout.tsx` — Wraps the app in the `Provider` and page frame
- `src/app/dashboard/(components)/Content.tsx` — Example instance management UI
- API routes:
  - `src/app/api/manage-instance/route.ts` — Update instance metadata
  - `src/app/api/clone-instance/route.ts` — Clone an instance
  - `src/app/api/schedule-meeting/route.ts` — Demo endpoint (scheduling)

## Technologies Used

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS + Shadcn UI
- YourGPT Widget Web SDK
- Radix primitives, Lucide icons, Sonner toasts

## FAQ

**Q: Where does instance data persist?**

A: The example seeds and stores instance data in `localStorage` to keep the demo self-contained. See `Content.tsx` for details.

**Q: How are network entries and logs captured?**

A: The YourGPT in-page chatbot SDK attaches to `window.$yourgptChatbot` and provides actions like `network:initCapture`, `network:getEntries`, `logs:initCapture`, and `logs:getLogs`. The provider initializes capture on startup and the AI actions query the data on demand.

**Q: How do I change capture defaults (filters, limits, masking)?**

A: Edit `src/app/provider.tsx` in the `network:initCapture`, `network:getEntries`, and `logs:getLogs` calls to adjust settings.

**Q: Do I need to define these actions in the YourGPT dashboard?**

A: Yes. Create actions named `capture_network` and `capture_logs` that your assistant can call. These names must match the ones registered in `useAIActions()`.


