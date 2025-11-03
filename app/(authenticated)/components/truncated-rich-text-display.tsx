"use client";

import { useState } from "react";
import { Button } from "@/app/design-system/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { RichTextDisplay } from "./rich-text-display";

interface TruncatedRichTextDisplayProps {
  content: string;
  maxLength?: number;
  className?: string;
}

export function TruncatedRichTextDisplay({ 
  content, 
  maxLength = 200, 
  className = "" 
}: TruncatedRichTextDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Strip HTML tags to get plain text for length calculation
  const stripHtml = (html: string) => {
    // Check if DOMParser is available (client-side only)
    if (typeof window === 'undefined' || !window.DOMParser) {
      // Fallback for server-side: simple regex to remove HTML tags
      return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }
    
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };
  
  const plainText = stripHtml(content);
  const shouldTruncate = plainText.length > maxLength;
  
  const displayContent = isExpanded 
    ? content 
    : shouldTruncate 
      ? plainText.substring(0, maxLength) + "..."
      : content;

  if (!shouldTruncate) {
    return (
      <RichTextDisplay content={content} className={className} />
    );
  }

  return (
    <div className={className}>
      {isExpanded ? (
        <RichTextDisplay content={content} />
      ) : (
        <div className="prose prose-sm sm:prose-base max-w-none">
          {displayContent}
        </div>
      )}
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
