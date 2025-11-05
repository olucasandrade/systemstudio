"use client";

import { Card } from "@/app/design-system/components/ui/card";
import { Badge } from "@/app/design-system/components/ui/badge";
import { Button } from "@/app/design-system/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { SolutionCard } from "../../components/solution-card";
import { VoteButtons } from "../../components/vote-buttons";
import { TruncatedDescription } from "../../components/truncated-description";
import { getDifficultyColor } from "@/app/lib/utils";
import { useChallenge, useSolutions, type Solution } from "../../hooks/use-challenges";
import { Spinner } from "@/app/design-system/components/ui/spinner";

interface ChallengeContentProps {
  challengeId: string;
}

function SolutionsList({ challengeId }: { challengeId: string }) {
  const { data: solutions, isLoading, error } = useSolutions(challengeId, "newest");

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-64 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <h3 className="mb-2 text-lg font-semibold">Error loading solutions</h3>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      </div>
    );
  }

  if (!solutions || solutions.length === 0) {
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
      {solutions.map((solution: (Solution & { commentsCount: number, user: { firstName: string, lastName: string, imageUrl: string } })) => (
        <SolutionCard key={solution.id} solution={solution} challengeId={challengeId} />
      ))}
    </div>
  );
}

export function ChallengeContent({ challengeId }: ChallengeContentProps) {
  const { data: challenge, isLoading, error } = useChallenge(challengeId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-dashed p-12 text-center">
          <h3 className="mb-2 text-lg font-semibold">Challenge not found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {error instanceof Error ? error.message : "The challenge you're looking for doesn't exist."}
          </p>
          <Link href="/challenges" prefetch={true}>
            <Button>Back to Challenges</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Link href="/challenges" prefetch={true}>
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
              entityId={challengeId}
              initialUpvotes={challenge.upvotesCount || 0}
              initialDownvotes={challenge.downvotesCount || 0}
              height={40}
            />
            <Link href={`/challenges/${challengeId}/solve`} prefetch={true}>
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
          Solutions ({challenge.solutionsCount || 0})
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
        <SolutionsList challengeId={challengeId} />
      </Suspense>
    </div>
  );
}

