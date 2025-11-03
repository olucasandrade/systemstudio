import { Challenge, database } from "@/app/database";
import { Card } from "@/app/design-system/components/ui/card";
import { Badge } from "@/app/design-system/components/ui/badge";
import { Button } from "@/app/design-system/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { TruncatedDescription } from "../components/truncated-description";
import { InfiniteChallengesList } from "./infinite-challenges-list";

async function getChallenges(page = 1, pageSize = 20, sort = "createdAt", order = "desc"): Promise<{
  data: (Challenge & { solutionsCount: number })[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/challenges?page=${page}&pageSize=${pageSize}&sort=${sort}&order=${order}`);
  console.log(response)
  if (!response.ok) throw new Error("Failed to fetch challenges");

  const res = await response.json();
  return res;
}

async function ChallengesList() {
  const result = await getChallenges(1, 20, "createdAt", "desc");
  const hasMore = result.meta.page < result.meta.totalPages;

  return <InfiniteChallengesList initialChallenges={result.data} initialHasMore={hasMore} />;
}

export default function ChallengesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8" data-animate="fadeInUp">
        <h1 className="mb-2 text-3xl font-bold">System Design Challenges</h1>
        <p className="text-muted-foreground">
          Practice system design by solving real-world problems
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-48 animate-pulse bg-muted" />
            ))}
          </div>
        }
      >
        <ChallengesList />
      </Suspense>
    </div>
  );
}



