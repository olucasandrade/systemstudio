"use client";

import { Button } from "@/app/design-system/components/ui/button";
import { Card } from "@/app/design-system/components/ui/card";
import { Badge } from "@/app/design-system/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/app/design-system/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { Spinner } from "@/app/design-system/components/ui/spinner";
import { RichTextEditor } from "@/app/(authenticated)/components/rich-text-editor";
import { useStatsUpdate } from "@/app/(authenticated)/hooks/use-stats-update";
import { useTheme } from "next-themes";
import "@excalidraw/excalidraw/index.css";
import { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { AppState } from "@excalidraw/excalidraw/types";

const Excalidraw = dynamic(
  async () => {
    const { Excalidraw } = await import("@excalidraw/excalidraw");
    return Excalidraw;
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-muted">
        <Spinner />
      </div>
    ),
  }
);

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
}

interface SolutionEditorProps {
  challenge: Challenge;
}

export function SolutionEditor({ challenge }: SolutionEditorProps) {
  const router = useRouter();
  const { updateStats } = useStatsUpdate();
  const { theme } = useTheme();
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [canvasData, setCanvasData] = useState<{ elements: readonly OrderedExcalidrawElement[], appState: AppState } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`solution-draft-${challenge.id}`);
    if (saved) {
      try {
        const { description: savedDesc } = JSON.parse(saved);
        setDescription(savedDesc || "");
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }
  }, [challenge.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem(`solution-draft-${challenge.id}`);
      const currentData = saved ? JSON.parse(saved) : {};
      localStorage.setItem(
        `solution-draft-${challenge.id}`,
        JSON.stringify({
          ...currentData,
          description,
        })
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [description, challenge.id]);

  const handleExcalidrawChange = useCallback((elements: readonly OrderedExcalidrawElement[], appState: AppState) => {
    try {
      const excalidrawData = { elements, appState };
      setCanvasData(excalidrawData);
      console.log("Auto-saving Excalidraw data:", excalidrawData);
      const saved = localStorage.getItem(`solution-draft-${challenge.id}`);
      const currentData = saved ? JSON.parse(saved) : {};
      localStorage.setItem(
        `solution-draft-${challenge.id}`,
        JSON.stringify({
          ...currentData,
          canvasData: excalidrawData,
        })
      );
    } catch (error) {
      console.error("Failed to save Excalidraw data:", error);
    }
  }, [challenge.id]);

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error("Please add a description for your solution");
      return;
    }

    try {
      setIsSubmitting(true);

      // Use the canvas data from state
      console.log("Canvas data captured:", canvasData);

      const response = await fetch(`/api/solutions/challenge/${challenge.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          canvasData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit solution");
      }

      localStorage.removeItem(`solution-draft-${challenge.id}`);

      // Update user stats
      await updateStats();

      toast.success("Solution submitted successfully!");
      router.push(`/challenges/${challenge.id}`);
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to submit solution");
      console.error("Error submitting solution:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  function getDifficultyColor(difficulty: string) {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/10 text-green-500";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500";
      case "hard":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="border-b bg-background p-4">
        <div className="container mx-auto">
          <div className="mb-2 flex items-center justify-between">
            <Link href={`/challenges/${challenge.id}`}>
              <Button variant="ghost" size="sm">
                ← Back
              </Button>
            </Link>
            <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
              {isSubmitting ? "Submitting..." : "Submit Solution"}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{challenge.title}</h1>
            <Badge className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden gap-4">
         <div className="flex-1 rounded-lg overflow-hidden">
            <div className="h-[400px] lg:h-full p-4 lg:p-6">
              <Excalidraw
                onChange={handleExcalidrawChange}
                initialData={{
                  elements: [],
                }}
                theme={theme === 'dark' ? 'dark' : 'light'}
              />
            </div>
         </div>

        <div className="flex w-full lg:w-[400px] flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <Collapsible open={showHints} onOpenChange={setShowHints} className="mb-4">
              <Card className="p-4">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0">
                    <h2 className="text-sm font-semibold">💡 Challenge Hints</h2>
                    {showHints ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {challenge.description}
                  </p>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <div>
              <h2 className="mb-2 text-sm font-semibold">Your Solution</h2>
              <RichTextEditor content={description} onChange={(content) => setDescription(content)} placeholder="Describe your solution approach, design decisions, trade-offs, and scalability considerations..." />
              <p className="mt-2 text-xs text-muted-foreground">Auto-saved locally</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
