"use client";

import { Card } from "@/app/design-system/components/ui/card";
import { Button } from "@/app/design-system/components/ui/button";
import { Badge } from "@/app/design-system/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/app/design-system/components/ui/collapsible";
import { MessageSquare, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { VoteButtons } from "./vote-buttons";
import { CommentList } from "./comment-list";
import { TruncatedRichTextDisplay } from "./truncated-rich-text-display";
import { Solution } from "../hooks/use-challenges";

interface SolutionCardProps {
  solution: (Solution & { commentsCount: number, user: { firstName: string, lastName: string, imageUrl: string } })
  challengeId: string;
}

export function SolutionCard({ solution, challengeId }: SolutionCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentsCount] = useState(solution.commentsCount || 0);

  const userName = solution.user
    ? `${solution.user.firstName || ""} ${solution.user.lastName || ""}`.trim() || "Anonymous"
    : "Anonymous";

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {userName}
            </span>
            <Badge variant="outline">
              {new Date(solution.createdAt).toLocaleDateString()}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Link 
            href={`/challenges/${challengeId}/solutions/${solution.id}`}
            prefetch={true}
          >
            <Button variant="outline" size="sm">
              <Eye className="mr-1 h-4 w-4" />
              View
            </Button>
          </Link>
          <VoteButtons
            entityType="solution"
            entityId={solution.id}
            initialUpvotes={solution.upvotesCount}
            initialDownvotes={solution.downvotesCount}
          />
        </div>
      </div>

      <div className="mb-4">
        <TruncatedRichTextDisplay 
          content={solution.description} 
          maxLength={150}
          className="text-sm text-muted-foreground"
        />
      </div>

      <Collapsible open={showComments} onOpenChange={setShowComments}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {commentsCount} Comments
            </span>
            {showComments ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <CommentList solutionId={solution.id} />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

