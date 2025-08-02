import { useEffect, useRef, useState } from "react";
import { useYourGPT } from "./YourGPTProvider";

interface YourGPTWidgetProps {
  className?: string;
  style?: React.CSSProperties;
}

export function YourGPTWidget({ className, style }: YourGPTWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isInitialized } = useYourGPT();
  const [isBrowser, setIsBrowser] = useState(false);
  const mode = typeof window !== "undefined" ? window.YGC_MODE : "floating";

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Handle embedded mode container
  useEffect(() => {
    if (!containerRef.current || mode !== "embedded") return;

    // For embedded mode, let widget render in our container
    if (mode === "embedded") {
      window.YGC_WIDGET?.renderEmbedded(containerRef.current);
    }
  }, [isInitialized]);

  // Don't render anything during SSR
  if (!isBrowser) {
    return null;
  }

  // Only render container for embedded mode
  if (mode === "embedded") {
    return (
      <div
        ref={containerRef}
        id={`yourgpt-container-${Math.random()}`}
        className={className}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          ...style,
        }}
      />
    );
  }

  // Nothing to render for floating mode
  return null;
}
