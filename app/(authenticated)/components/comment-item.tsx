"use client";

import { Button } from "@/app/design-system/components/ui/button";
import { Textarea } from "@/app/design-system/components/ui/textarea";
import { useAuth } from "@/app/auth/client";
import { Edit2, Trash2, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { VoteButtons } from "./vote-buttons";

interface CommentItemProps {
  comment: {
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
  };
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export function CommentItem({ comment, onUpdate, onDelete }: CommentItemProps) {
  const { userId } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isLoading, setIsLoading] = useState(false);

  const isOwner = userId === comment.userId;

  const handleSave = async () => {
    if (!editContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });

      if (!response.ok) throw new Error("Failed to update comment");

      onUpdate(comment.id, editContent);
      setIsEditing(false);
      toast.success("Comment updated");
    } catch (error) {
      toast.error("Failed to update comment");
      console.error("Error updating comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete comment");

      onDelete(comment.id);
      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Failed to delete comment");
      console.error("Error deleting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const userName = comment.user
    ? `${comment.user.firstName || ""} ${comment.user.lastName || ""}`.trim() || "Anonymous"
    : "Anonymous";

  return (
    <div className="border-b pb-4 last:border-b-0">
      <div className="mb-2 flex items-start justify-between">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">{userName}</span>
          <span className="mx-2">•</span>
          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        {isOwner && !isEditing && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            disabled={isLoading}
          />
          <div className="flex gap-2 mb-2">
            <Button size="sm" onClick={handleSave} disabled={isLoading}>
              <Save className="mr-1 h-3 w-3" />
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="mr-1 h-3 w-3" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="mb-3 text-sm">{comment.content}</p>
      )}

      <VoteButtons
        entityType="comment"
        entityId={comment.id}
        initialUpvotes={comment.upvotesCount}
        initialDownvotes={comment.downvotesCount}
      />
    </div>
  );
}

