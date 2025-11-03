"use client";

import { Button } from "@/app/design-system/components/ui/button";
import { Textarea } from "@/app/design-system/components/ui/textarea";
import { useAuth } from "@/app/auth/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CommentItem } from "./comment-item";

interface Comment {
  id: string;
  userId: string;
  content: string;
  upvotesCount: number;
  downvotesCount: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string | null;
    lastName: string | null;
    imageUrl: string;
  } | null;
}

interface CommentListProps {
  solutionId: string;
}

export function CommentList({ solutionId }: CommentListProps) {
  const { userId } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [solutionId]);

  const fetchComments = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(`/api/comments/solution/${solutionId}`);
      if (!response.ok) throw new Error("Failed to fetch comments");

      const data = await response.json();
      setComments(data.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Please sign in to comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/comments/solution/${solutionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) throw new Error("Failed to create comment");

      const comment = await response.json();
      setComments([comment, ...comments]);
      setNewComment("");
      toast.success("Comment posted");
    } catch (error) {
      toast.error("Failed to post comment");
      console.error("Error creating comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (id: string, content: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, content } : c))
    );
  };

  const handleDelete = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  if (isFetching) {
    return <div className="text-sm text-muted-foreground">Loading comments...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Comments ({comments.length})
      </h3>

      {userId && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            Post Comment
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

