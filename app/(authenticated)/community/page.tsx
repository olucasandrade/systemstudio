import { Card } from "@/app/design-system/components/ui/card";
import { Badge } from "@/app/design-system/components/ui/badge";
import { Button } from "@/app/design-system/components/ui/button";
import { MessageCircle, Users, TrendingUp, Clock, ThumbsUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Comment, Solution } from "@/generated/client";

// Force dynamic rendering to prevent build-time data fetching
export const dynamic = 'force-dynamic';

async function getCommunityStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/community/stats`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch community stats");
    }

    const stats = await response.json();
    return stats;
  } catch (error) {
    console.error("Error fetching community stats:", error);
    return {
      totalUsers: 0,
      totalSolutions: 0,
      totalComments: 0,
      totalChallenges: 0,
    };
  }
}

async function getRecentActivity() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/community/activity`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch community activity");
    }

    const activity = await response.json();
    return activity;
  } catch (error) {
    console.error("Error fetching community activity:", error);
    return {
      recentSolutions: [],
      recentComments: [],
    };
  }
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "medium":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    case "hard":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
  }
}

export default async function CommunityPage() {
  const stats = await getCommunityStats();
  const { recentSolutions, recentComments } = await getRecentActivity();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Community</h1>
        <p className="text-muted-foreground">
          Connect with fellow system designers and share knowledge
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{stats.totalSolutions}</p>
              <p className="text-sm text-muted-foreground">Solutions</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{stats.totalComments}</p>
              <p className="text-sm text-muted-foreground">Comments</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{stats.totalChallenges}</p>
              <p className="text-sm text-muted-foreground">Challenges</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Solutions</h2>
            <Link href="/challenges">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {recentSolutions.map((solution: Solution & { user: { firstName: string, lastName: string, imageUrl: string }, challenge: { difficulty: string, title: string, id: string } }) => (
              <div key={solution.id} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  {solution.user?.imageUrl ? (
                    <Image
                      src={solution.user.imageUrl}
                      alt={`${solution.user.firstName} ${solution.user.lastName}`}
                      className="h-8 w-8 rounded-full"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <span className="text-sm font-semibold">
                      {solution.user?.firstName?.[0] || "?"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {solution.user
                        ? `${solution.user.firstName || ""} ${solution.user.lastName || ""}`.trim()
                        : "Anonymous"}
                    </span>
                    <Badge className={getDifficultyColor(solution.challenge.difficulty)}>
                      {solution.challenge.difficulty}
                    </Badge>
                  </div>
                  <Link
                    href={`/challenges/${solution.challenge.id}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {solution.challenge.title}
                  </Link>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {solution.upvotesCount}
                    </span>
                    <span>{new Date(solution.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Comments</h2>
          </div>
          <div className="space-y-4">
            {recentComments.map((comment: Comment & { user: { firstName: string, lastName: string, imageUrl: string }, solution: { challenge: { id: string }, id: string } }) => (
              <div key={comment.id} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  {comment.user?.imageUrl ? (
                    <Image
                      src={comment.user.imageUrl}
                      alt={`${comment.user.firstName} ${comment.user.lastName}`}
                      className="h-8 w-8 rounded-full"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <span className="text-sm font-semibold">
                      {comment.user?.firstName?.[0] || "?"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {comment.user
                        ? `${comment.user.firstName || ""} ${comment.user.lastName || ""}`.trim()
                        : "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {comment.content}
                  </p>
                  <Link
                    href={`/challenges/${comment.solution.challenge.id}/solutions/${comment.solution.id}`}
                    className="text-xs text-primary hover:underline"
                  >
                    View solution →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-8 p-6">
        <h2 className="mb-1 text-xl font-semibold">Community Guidelines</h2>
        <div className="prose prose-sm max-w-none">
          <ul className="space-y-2">
            <li>Be respectful and constructive in your feedback</li>
            <li>Share detailed explanations for your design decisions</li>
            <li>Ask questions to learn from others&apos; solutions</li>
            <li>Provide helpful comments and suggestions</li>
            <li>Follow the challenge requirements and constraints</li>
            <li>Use proper formatting and clear diagrams</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}

