"use client";

import dynamic from "next/dynamic";
import { Spinner } from "@/app/design-system/components/ui/spinner";
import { useTheme } from "next-themes";
import "@excalidraw/excalidraw/index.css";

const Excalidraw = dynamic(
  async () => {
    const { Excalidraw } = await import("@excalidraw/excalidraw");
    return Excalidraw;
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] items-center justify-center bg-muted">
        <Spinner />
      </div>
    ),
  }
);

interface SolutionViewerProps {
  canvasData: string;
}

export function SolutionViewer({ canvasData }: SolutionViewerProps) {
  const { theme } = useTheme();
  
  if (!canvasData) {
    return (
      <div className="flex h-[500px] items-center justify-center bg-muted text-sm text-muted-foreground">
        No diagram available
      </div>
    );
  }

  // Parse canvas data if it's a string, otherwise use as-is
  let initialData;
  try {
    const parsedData = typeof canvasData === 'string' ? JSON.parse(canvasData) : canvasData;
    initialData = {
      elements: parsedData.elements || [],
      appState: {
        viewBackgroundColor: "#ffffff",
        ...parsedData.appState,
        // Ensure collaborators is an array
        collaborators: Array.isArray(parsedData.appState?.collaborators) 
          ? parsedData.appState.collaborators 
          : [],
      },
    };
  } catch (error) {
    console.error("Failed to parse canvas data:", error);
    initialData = {
      elements: [],
      appState: { 
        viewBackgroundColor: "#ffffff",
        collaborators: [],
      },
    };
  }

  return (
    <div className="h-[400px] sm:h-[500px] lg:h-[600px] border rounded-lg overflow-hidden">
      <Excalidraw
        initialData={{
          ...initialData,
          appState: {
            ...initialData.appState,
          }
        }}
        viewModeEnabled={true}
        zenModeEnabled={false}
        gridModeEnabled={false}
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
}


