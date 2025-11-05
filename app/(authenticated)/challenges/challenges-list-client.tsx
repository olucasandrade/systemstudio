"use client";

import { Card } from "@/app/design-system/components/ui/card";
import { useChallenges } from "../hooks/use-challenges";
import { InfiniteChallengesList } from "./infinite-challenges-list";

export function ChallengesListClient() {
  const { data, isLoading, error } = useChallenges(1, 20, "createdAt", "desc");

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-48 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <h3 className="mb-2 text-lg font-semibold">Error loading challenges</h3>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <h3 className="mb-2 text-lg font-semibold">No Challenges Yet</h3>
        <p className="text-sm text-muted-foreground">
          Challenges will appear here once they are added.
        </p>
      </div>
    );
  }

  const hasMore = data.meta.page < data.meta.totalPages;

  return <InfiniteChallengesList initialChallenges={data.data} initialHasMore={hasMore} />;
}

