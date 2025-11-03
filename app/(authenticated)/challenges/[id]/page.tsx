import { Solution } from "@/app/database";
import { Card } from "@/app/design-system/components/ui/card";
import { Badge } from "@/app/design-system/components/ui/badge";
import { Button } from "@/app/design-system/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SolutionCard } from "../../components/solution-card";
import { VoteButtons } from "../../components/vote-buttons";
import { TruncatedDescription } from "../../components/truncated-description";
import { getDifficultyColor } from "@/app/lib/utils";

async function getChallenge(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/challenges/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch challenge");
    }

    const challenge = await response.json();
    return challenge;
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return null;
  }
}

async function getSolutions(challengeId: string, sortBy: string = "newest"): Promise<(Solution & { commentsCount: number, user: { firstName: string, lastName: string, imageUrl: string } })[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/solutions/challenge/${challengeId}?sortBy=${sortBy}`);
  if (!response.ok) throw new Error("Failed to fetch solutions");
  const res = await response.json();
  return res.data;
}


async function SolutionsList({ challengeId, sortBy }: { challengeId: string, sortBy: string }) {
  const solutions = await getSolutions(challengeId, sortBy);

  if (solutions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <h3 className="mb-2 text-lg font-semibold">No Solutions Yet</h3>
        <p className="text-sm text-muted-foreground">
          Be the first to solve this challenge!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {solutions.map((solution) => (
        <SolutionCard key={solution.id} solution={solution} challengeId={challengeId} />
      ))}
    </div>
  );
}

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challenge = await getChallenge(id);

  if (!challenge) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Link href="/challenges">
          <Button variant="ghost" className="mb-4">
            ← Back to Challenges
          </Button>
        </Link>

        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h1 className="text-3xl font-bold">{challenge.title}</h1>
              <Badge className={getDifficultyColor(challenge.difficulty)}>
                {challenge.difficulty}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {challenge.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <VoteButtons
              entityType="challenge"
              entityId={id}
              initialUpvotes={challenge.upvotesCount || 0}
              initialDownvotes={challenge.downvotesCount || 0}
              height={40}
            />
            <Link href={`/challenges/${id}/solve`}>
              <Button size="lg">Solve Challenge</Button>
            </Link>
          </div>
        </div>

        <Card className="p-6">
          <TruncatedDescription 
            content={challenge.description}
            maxLength={300}
            className="prose prose-sm dark:prose-invert max-w-none"
          />
        </Card>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Solutions ({challenge.solutionsCount})
        </h2>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-64 animate-pulse bg-muted" />
            ))}
          </div>
        }
      >
        <SolutionsList challengeId={id} sortBy="newest"/>
      </Suspense>
    </div>
  );
}

