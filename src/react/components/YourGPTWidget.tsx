import { useEffect, useRef } from "react";
import { useYourGPT } from "./YourGPTProvider";

interface YourGPTWidgetProps {
  className?: string;
  style?: React.CSSProperties;
}

export function YourGPTWidget({ className, style }: YourGPTWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mode, isInitialized } = useYourGPT();

  // Handle embedded mode container
  useEffect(() => {
    if (!containerRef.current || !isInitialized || mode !== "embedded") return;

    // For embedded mode, let widget render in our container
    if (window.YGC_MODE === "embedded") {
      window.YGC_WIDGET?.renderEmbedded(containerRef.current);
    }
  }, [isInitialized, mode]);

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
