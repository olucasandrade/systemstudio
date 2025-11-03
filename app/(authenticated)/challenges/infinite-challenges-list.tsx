"use client";

import { Card } from "@/app/design-system/components/ui/card";
import { Badge } from "@/app/design-system/components/ui/badge";
import { useEffect, useState, useCallback } from "react";
import { animations, addHoverAnimation } from "../lib/animations";
import { AnimatedButton } from "../components/animated-button";
import { Challenge } from "@/app/database";
import { getDifficultyColor } from "@/app/lib/utils";

interface ChallengeWithCount extends Challenge {
  solutionsCount: number;
}

interface InfiniteChallengesListProps {
  initialChallenges: ChallengeWithCount[];
  initialHasMore: boolean;
}

export function InfiniteChallengesList({ initialChallenges, initialHasMore }: InfiniteChallengesListProps) {
  const getUniqueChallenges = (challengesList: ChallengeWithCount[]): ChallengeWithCount[] => {
    const seen = new Map<string, ChallengeWithCount>();
    challengesList.forEach(challenge => {
      if (!seen.has(challenge.id as string)) {
        seen.set(challenge.id as string, challenge);
      }
    });
    return Array.from(seen.values());
  };

  const [challenges, setChallenges] = useState<ChallengeWithCount[]>(() => 
    getUniqueChallenges(initialChallenges)
  );
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    animations.fadeInUp('[data-animate="fadeInUp"]', 0);
  }, []);

  useEffect(() => {
    addHoverAnimation(
      '.challenge-card',
      (el) => animations.cardHover(el),
      (el) => animations.cardLeave(el)
    );
  }, []);

  useEffect(() => {
    document.querySelectorAll('.challenge-button').forEach((button) => {
      button.addEventListener('click', (e) => {
        animations.buttonClick(e.target as HTMLElement);
      });
    });
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await fetch(`/api/challenges?page=${nextPage}&pageSize=20&sort=createdAt&order=desc`);
      
      if (!response.ok) throw new Error("Failed to fetch challenges");
      
      const data = await response.json();
      
      setChallenges(prev => {
        const existingIds = new Set(prev.map(challenge => challenge.id));
        const newChallenges = data.data.filter((challenge: ChallengeWithCount) => 
          !existingIds.has(challenge.id)
        );
        return [...prev, ...newChallenges];
      });
      setHasMore(data.meta.page < data.meta.totalPages);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more challenges:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  if (challenges.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center" data-animate="fadeInUp">
        <h3 className="mb-2 text-lg font-semibold">No Challenges Yet</h3>
        <p className="text-sm text-muted-foreground">
          Challenges will appear here once they are added.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {challenges.map((challenge, index) => (
          <Card 
            key={challenge.id as string} 
            className="challenge-card group transition-all duration-200"
            data-animate="fadeInUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    className={`difficulty-badge ${getDifficultyColor(challenge.difficulty)} font-medium px-3 py-1 cursor-pointer`}
                  >
                    {challenge.difficulty}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">
                  {challenge.title}
                </h3>
                <p className="text-muted-foreground line-clamp-1">
                  {challenge.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {challenge.tags.slice(0, 2).map((tag) => (
                  <Badge 
                      key={tag}
                      variant="secondary"
                      className="text-xs font-medium px-2 py-1 bg-muted/50 hover:bg-muted/70 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                {challenge.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs font-medium px-2 py-1 bg-muted/50 hover:bg-muted/70 transition-colors">
                    +{challenge.tags.length - 2}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse"></div>
                    <span className="font-medium">{challenge.solutionsCount} solutions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/60"></div>
                    <span>{new Date(challenge.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <AnimatedButton
                  href={`/challenges/${challenge.id}`}
                  className="challenge-button group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"
                  transitionType="scale"
                >
                  View Challenge
                </AnimatedButton>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Loading more challenges...</span>
          </div>
        </div>
      )}

      {/* End of results */}
      {!hasMore && challenges.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="text-muted-foreground text-sm">
            You&apos;ve reached the end of the challenges
          </div>
        </div>
      )}
    </>
  );
}

