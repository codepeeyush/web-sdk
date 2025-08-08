import { YourGPT, useAIActions } from "@yourgpt/widget-web-sdk/react";
import { useEffect, useRef, useState } from "react";



type ScreenshotType = "area" | "viewport" | "fullPage";

type SendMessageArgs = {
  text: string;
  sendImmediately: boolean;
  attachments: File[];
};

interface YourGPTExecutor {
  execute(action: "widget:close"): Promise<void> | void;
  execute(action: "widget:open"): Promise<void> | void;
  execute(action: "screenshot:capture", args: { type: ScreenshotType }): Promise<File | null>;
  execute(action: "message:send", args: SendMessageArgs): Promise<void> | void;
}

const getChatbot = (): YourGPTExecutor | undefined => {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { $yourgptChatbot?: YourGPTExecutor };
  return w.$yourgptChatbot;
};

const takeScreenshot = async (type: ScreenshotType): Promise<File | null | undefined> => {
  const ygc = getChatbot();
  if (!ygc) return;

  await ygc.execute("widget:close");
  // Small delay to ensure widget fully closes before capture (avoids capturing the widget)
  await new Promise<void>((resolve) => setTimeout(resolve, 500));

  const imageFile = await ygc.execute("screenshot:capture", { type });

  await ygc.execute("widget:open");
  return imageFile;
}


const App = () => {

  const [screenshotMsg, setScreenshotMsg] = useState<string>("");
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");
  const lastObjectUrlRef = useRef<string | null>(null);

  const { registerAction, unregisterAction } = useAIActions();

  useEffect(() => {

    YourGPT.init({
      widgetId: import.meta.env.VITE_WIDGET_UID!,
      endpoint: import.meta.env.VITE_WIDGET_ENDPOINT!,
      debug: true,
    });

    registerAction("take_screenshot", async (data, helpers) => {
      try {
        // Optional: get type from the tool/function call arguments sent by the LLM
        const rawArgs = data.action.tool?.function?.arguments ?? "{}";
        const args = JSON.parse(rawArgs) as { type?: ScreenshotType };
        const type = args?.type ?? "viewport"; // "area" | "viewport" | "fullPage"
        const file = await takeScreenshot(type);
        if (file) {
          // Revoke previous object URL if any
          if (lastObjectUrlRef.current) {
            URL.revokeObjectURL(lastObjectUrlRef.current);
          }
          const url = URL.createObjectURL(file);
          lastObjectUrlRef.current = url;
          setScreenshotUrl(url);
          setScreenshotMsg("");
          const msg = "Screenshot captured.";
          helpers.respond(msg);
        } else {
          const msg = "No screenshot captured.";
          setScreenshotMsg(msg);
          setScreenshotUrl("");
          helpers.respond(msg);
        }
      } catch (err) {
        const msg = "Failed to capture screenshot.";
        setScreenshotMsg(msg);
        helpers.respond(msg);
        console.error(err);
      }
    });

    return () => {
      unregisterAction("take_screenshot");
    };
  }, [registerAction, unregisterAction]);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (lastObjectUrlRef.current) {
        URL.revokeObjectURL(lastObjectUrlRef.current);
        lastObjectUrlRef.current = null;
      }
    };
  }, []);


  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">YourGPT Web SDK Playground</h1>

        <div className="grid grid-cols-1 gap-6">
          <section className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Screenshot (AI Action-driven)</h2>
            <p className="text-sm text-gray-600 mb-4">Trigger the AI action "take_screenshot" from your LLM. When captured, the image will show below.</p>
            {screenshotUrl ? (
              <div className="rounded-md bg-gray-50 border p-3">
                <img
                  src={screenshotUrl}
                  alt="Captured screenshot"
                  className="max-h-96 w-auto rounded-md border"
                />
                <div className="mt-2 text-xs text-gray-600">
                  <a
                    href={screenshotUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    Open full image
                  </a>
                </div>
              </div>
            ) : (
              <div className="rounded-md bg-gray-50 border p-3 font-mono text-sm whitespace-pre-wrap min-h-10">
                {screenshotMsg || "No screenshot response yet"}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default App
