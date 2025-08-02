"use client";

import { YourGPTProvider } from "@yourgpt/widget-web-sdk/react";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <YourGPTProvider
      onError={(error) => {
        console.error("SDFK <ERRRR", error);
      }}
      config={{
        widgetId: process.env.NEXT_PUBLIC_WIDGET_UID!,
        endpoint: process.env.NEXT_PUBLIC_WIDGET_ENDPOINT!,
        mode: "embedded",
      }}
    >
      <>{children}</>
    </YourGPTProvider>
  );
}
