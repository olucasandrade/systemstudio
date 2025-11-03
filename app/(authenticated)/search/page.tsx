import { Card } from "@/app/design-system/components/ui/card";
import { Badge } from "@/app/design-system/components/ui/badge";
import { Button } from "@/app/design-system/components/ui/button";
import { Input } from "@/app/design-system/components/ui/input";
import { Search, Filter, SortAsc } from "lucide-react";
import Link from "next/link";
import { TruncatedDescription } from "../components/truncated-description";

interface SearchParams {
  q?: string;
  difficulty?: string;
  sort?: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  createdAt: string;
  solutionsCount: number;
}

async function searchChallenges(params: SearchParams): Promise<Challenge[]> {
  try {
    const { q, difficulty, sort = "newest" } = params;
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const searchParams = new URLSearchParams();
    
    if (q) searchParams.set("q", q);
    if (difficulty) searchParams.set("difficulty", difficulty);
    if (sort) searchParams.set("sort", sort);
    
    const response = await fetch(`${baseUrl}/api/challenges/search?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error("Failed to search challenges");
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error searching challenges:", error);
    return [];
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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const challenges = await searchChallenges(params);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Search Challenges</h1>
        <p className="text-muted-foreground">
          Find the perfect system design challenge for you
        </p>
      </div>

      {/* Search Form */}
      <Card className="mb-8 p-6">
        <form method="GET" className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="q"
                  placeholder="Search challenges, tags, or descriptions..."
                  defaultValue={params.q || ""}
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Difficulty:</label>
              <select
                name="difficulty"
                defaultValue={params.difficulty || ""}
                className="rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                <option value="">All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Sort by:</label>
              <select
                name="sort"
                defaultValue={params.sort || "newest"}
                className="rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="most_solutions">Most Solutions</option>
                <option value="difficulty">Difficulty</option>
              </select>
            </div>
          </div>
        </form>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {challenges.length === 0 ? (
          <Card className="p-8 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No challenges found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all challenges.
            </p>
            <Link href="/challenges" className="mt-4 inline-block">
              <Button>Browse All Challenges</Button>
            </Link>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Found {challenges.length} challenge{challenges.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-semibold">{challenge.title}</h3>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <TruncatedDescription 
                        content={challenge.description}
                        maxLength={150}
                        className="mb-4 text-sm text-muted-foreground"
                      />
                      <div className="flex flex-wrap gap-2 mb-4">
                        {challenge.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                        <span>{challenge.solutionsCount} solutions</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{new Date(challenge.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Link href={`/challenges/${challenge.id}`}>
                        <Button className="w-full sm:w-auto">View Challenge</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}