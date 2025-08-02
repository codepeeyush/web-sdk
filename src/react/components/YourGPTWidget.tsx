import { useEffect, useRef, useState } from "react";
import { useYourGPT } from "./YourGPTProvider";

interface YourGPTWidgetProps {
  className?: string;
  style?: React.CSSProperties;
  /** Optional callback when widget is mounted */
  onMount?: () => void;
  /** Optional callback when widget is unmounted */
  onUnmount?: () => void;
}

export function YourGPTWidget({ className, style, onMount, onUnmount }: YourGPTWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isInitialized } = useYourGPT();
  const [isBrowser, setIsBrowser] = useState(false);
  const mode = typeof window !== "undefined" ? window.YGC_MODE : "floating";

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Handle embedded mode container
  useEffect(() => {
    if (!isInitialized || !isBrowser) return undefined;

    // Handle widget rendering and cleanup
    const container = containerRef.current;
    if (!container || mode !== "embedded") return undefined;

    window.YGC_WIDGET?.renderEmbedded(container);
    onMount?.();

    return () => {
      // @ts-ignore
      window.YGC_WIDGET?.cleanup?.();
      onUnmount?.();
    };
  }, [isInitialized, isBrowser, mode]);

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
