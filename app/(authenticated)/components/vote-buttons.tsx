"use client";

import { Button } from "@/app/design-system/components/ui/button";
import { useAuth } from "@/app/auth/client";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface VoteButtonsProps {
  entityType: "challenge" | "solution" | "comment";
  entityId: string;
  height?: number;
  initialUpvotes: number;
  initialDownvotes: number;
  onVoteChange?: (upvotes: number, downvotes: number) => void;
}

export function VoteButtons({
  entityType,
  entityId,
  initialUpvotes,
  initialDownvotes,
  onVoteChange,
  height,
}: VoteButtonsProps) {
  const { userId } = useAuth();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's current vote
  useEffect(() => {
    if (!userId) return;

    const fetchUserVote = async () => {
      try {
        const response = await fetch(
          `/api/votes/user-vote/${entityType}/${entityId}`
        );
        if (response.ok) {
          const data = await response.json();
          setUserVote(data.userVote);
        }
      } catch (error) {
        console.error("Error fetching user vote:", error);
      }
    };

    fetchUserVote();
  }, [userId, entityType, entityId]);

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId) {
      toast.error("Please sign in to vote");
      return;
    }

    if (isLoading) return;

    // Optimistic update
    const prevUpvotes = upvotes;
    const prevDownvotes = downvotes;
    const prevUserVote = userVote;

    try {
      setIsLoading(true);

      // Calculate optimistic counts
      let newUpvotes = upvotes;
      let newDownvotes = downvotes;

      if (userVote === voteType) {
        // Remove vote
        if (voteType === "upvote") {
          newUpvotes = Math.max(0, upvotes - 1);
        } else {
          newDownvotes = Math.max(0, downvotes - 1);
        }
        setUserVote(null);
      } else {
        // Add or change vote
        if (userVote === "upvote") {
          newUpvotes = Math.max(0, upvotes - 1);
        } else if (userVote === "downvote") {
          newDownvotes = Math.max(0, downvotes - 1);
        }

        if (voteType === "upvote") {
          newUpvotes++;
        } else {
          newDownvotes++;
        }
        setUserVote(voteType);
      }

      setUpvotes(newUpvotes);
      setDownvotes(newDownvotes);
      onVoteChange?.(newUpvotes, newDownvotes);

      // Make API call
      if (userVote === voteType) {
        // Delete vote
        const response = await fetch(`/api/votes/${entityType}/${entityId}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to remove vote");

        const data = await response.json();
        setUpvotes(data.upvotesCount);
        setDownvotes(data.downvotesCount);
        onVoteChange?.(data.upvotesCount, data.downvotesCount);
      } else {
        // Create or update vote
        const response = await fetch("/api/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entityType, entityId, voteType }),
        });

        if (!response.ok) throw new Error("Failed to vote");

        const data = await response.json();
        setUpvotes(data.upvotesCount);
        setDownvotes(data.downvotesCount);
        onVoteChange?.(data.upvotesCount, data.downvotesCount);
      }
    } catch (error) {
      // Rollback on error
      setUpvotes(prevUpvotes);
      setDownvotes(prevDownvotes);
      setUserVote(prevUserVote);
      onVoteChange?.(prevUpvotes, prevDownvotes);
      toast.error("Failed to process vote");
      console.error("Error voting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={userVote === "upvote" ? "default" : "outline"}
        size="sm"
        style={{ height }}
        onClick={() => handleVote("upvote")}
        disabled={isLoading}
        className="gap-1"
      >
        <ArrowUp className="h-4 w-4" />
        <span>{upvotes}</span>
      </Button>
      <Button
        variant={userVote === "downvote" ? "default" : "outline"}
        size="sm"
        style={{ height }}
        onClick={() => handleVote("downvote")}
        disabled={isLoading}
        className="gap-1"
      >
        <ArrowDown className="h-4 w-4" />
        <span>{downvotes}</span>
      </Button>
    </div>
  );
}




