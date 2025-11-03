import { Card } from "@/app/design-system/components/ui/card";
import { Badge } from "@/app/design-system/components/ui/badge";
import { Trophy, Medal, Award, Star } from "lucide-react";
import { UserStats } from "@/app/database";
import Image from "next/image";

// Force dynamic rendering to prevent build-time data fetching
export const dynamic = 'force-dynamic';

async function getLeaderboard() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/leaderboard?limit=50`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard");
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Trophy className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />;
    default:
      return <Star className="h-5 w-5 text-muted-foreground" />;
  }
}

function getRankBadge(rank: number) {
  switch (rank) {
    case 1:
      return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">#1</Badge>;
    case 2:
      return <Badge className="bg-gray-400/10 text-gray-400 border-gray-400/20">#2</Badge>;
    case 3:
      return <Badge className="bg-amber-600/10 text-amber-600 border-amber-600/20">#3</Badge>;
    default:
      return <Badge variant="outline">#{rank}</Badge>;
  }
}

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">
          Top performers in system design challenges
        </p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <h3 className="mb-2 text-lg font-semibold">No users on the leaderboard yet.</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start solving challenges to earn points and climb the ranks!
          </p>
          <p className="text-xs text-muted-foreground">
            Points: 10 per solution + 3 per comment + 1 per upvote received
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <Card className="p-6">
              <h2 className="mb-6 text-2xl font-semibold">Top 3</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {leaderboard.slice(0, 3).map((user: UserStats & { user: { firstName: string, lastName: string, imageUrl: string } }, index: number) => (
                <div
                  key={user.id}
                  className={`rounded-lg border p-4 ${
                    index === 0
                      ? "bg-yellow-500/5 border-yellow-500/20"
                      : index === 1
                      ? "bg-gray-400/5 border-gray-400/20"
                      : "bg-amber-600/5 border-amber-600/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    {getRankIcon(index + 1)}
                    {getRankBadge(index + 1)}
                  </div>
                  <div className="text-center">
                    <div className="mb-2 h-12 w-12 rounded-full bg-muted mx-auto flex items-center justify-center">
                      {user.user?.imageUrl ? (
                        <Image
                          src={user.user.imageUrl}
                          alt={`${user.user.firstName} ${user.user.lastName}`}
                          className="h-12 w-12 rounded-full"
                          width={32}
                          height={32}
                        />
                      ) : (
                        <span className="text-lg font-semibold">
                          {user.user?.firstName?.[0] || "?"}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold">
                      {user.user
                        ? `${user.user.firstName || ""} ${user.user.lastName || ""}`.trim()
                        : "Anonymous"}
                    </h3>
                    <p className="text-2xl font-bold text-primary">{user.score}</p>
                    <p className="text-sm text-muted-foreground">points</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="p-6">
            <h2 className="mb-6 text-2xl font-semibold">Full Leaderboard</h2>
            <div className="space-y-3">
              {leaderboard.map((user: UserStats & { user: { firstName: string, lastName: string, imageUrl: string } }, index: number) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(index + 1)}
                      <span className="font-semibold">#{index + 1}</span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      {user.user?.imageUrl ? (
                        <Image
                          src={user.user.imageUrl}
                          alt={`${user.user.firstName} ${user.user.lastName}`}
                          className="h-10 w-10 rounded-full"
                          width={32}
                          height={32}
                        />
                      ) : (
                        <span className="font-semibold">
                          {user.user?.firstName?.[0] || "?"}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {user.user
                          ? `${user.user.firstName || ""} ${user.user.lastName || ""}`.trim()
                          : "Anonymous"}
                      </h3>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{user.solutionsCount} solutions</span>
                        <span>{user.commentsCount} comments</span>
                        <span>{user.upvotesReceived} upvotes</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{user.score}</p>
                    <p className="text-sm text-muted-foreground">points</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      )}
    </div>
  );
}
