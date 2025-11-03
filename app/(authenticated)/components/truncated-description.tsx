"use client";

import { useState } from "react";
import { Button } from "@/app/design-system/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TruncatedDescriptionProps {
  content: string;
  maxLength?: number;
  className?: string;
}

export function TruncatedDescription({ 
  content, 
  maxLength = 200, 
  className = "" 
}: TruncatedDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const paragraphs = content.split('\n\n');
  const firstParagraph = paragraphs[0] || "";
  const remainingParagraphs = paragraphs.slice(1);
  
  const shouldTruncate = firstParagraph.length > maxLength || remainingParagraphs.length > 0;
  const displayContent = isExpanded 
    ? content 
    : shouldTruncate 
      ? firstParagraph.length > maxLength 
        ? firstParagraph.substring(0, maxLength) + "..."
        : firstParagraph
      : content;

  if (!shouldTruncate) {
    return (
      <div className={`whitespace-pre-wrap ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="whitespace-pre-wrap">
        {displayContent}
        {!isExpanded && firstParagraph.length > maxLength && "..."}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 h-auto p-0 text-primary hover:text-primary/80"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="mr-1 h-4 w-4" />
            Show less
          </>
        ) : (
          <>
            <ChevronDown className="mr-1 h-4 w-4" />
            Show more
          </>
        )}
      </Button>
    </div>
  );
}

