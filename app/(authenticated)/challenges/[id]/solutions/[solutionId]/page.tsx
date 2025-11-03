import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/design-system/components/ui/button";
import { Card } from "@/app/design-system/components/ui/card";
import { Badge } from "@/app/design-system/components/ui/badge";
import { SolutionViewer } from "./solution-viewer";
import { VoteButtons } from "../../../../components/vote-buttons";
import { CommentList } from "../../../../components/comment-list";
import { RichTextDisplay } from "../../../../components/rich-text-display";

async function getSolution(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/solutions/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch solution");
    }

    const solution = await response.json();
    return solution;
  } catch (error) {
    console.error("Error fetching solution:", error);
    return null;
  }
}

export default async function SolutionViewPage({
  params,
}: {
  params: Promise<{ id: string; solutionId: string }>;
}) {
  const { id: challengeId, solutionId } = await params;
  const solution = await getSolution(solutionId);

  if (!solution) {
    notFound();
  }

  const userName = solution.user
    ? `${solution.user.firstName || ""} ${solution.user.lastName || ""}`.trim() || "Anonymous"
    : "Anonymous";

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Link href={`/challenges/${challengeId}`}>
          <Button variant="ghost" className="mb-4">
            ← Back to Challenge
          </Button>
        </Link>

        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold">Solution by {userName}</h1>
            <div className="flex items-center gap-2">
              <Link href={`/challenges/${solution.challenge.id}`}>
                <Badge variant="outline">
                  {solution.challenge.title}
                </Badge>
              </Link>
              <span className="text-sm text-muted-foreground">
                {new Date(solution.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <VoteButtons
            entityType="solution"
            entityId={solution.id}
            initialUpvotes={solution.upvotesCount}
            initialDownvotes={solution.downvotesCount}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Architecture Diagram</h2>
          <div className="rounded-lg border bg-muted/50">
            <SolutionViewer canvasData={solution.canvasData} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Solution Description</h2>
          <RichTextDisplay content={solution.description} />
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <CommentList solutionId={solution.id} />
      </Card>
    </div>
  );
}



