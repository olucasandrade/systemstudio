"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, FileText, Hash } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/app/design-system/components/ui/badge";
import { Input } from "@/app/design-system/components/ui/input";
import { Button } from "@/app/design-system/components/ui/button";
import { Card } from "@/app/design-system/components/ui/card";
import { ScrollArea } from "@/app/design-system/components/ui/scroll-area";
import { Spinner } from "@/app/design-system/components/ui/spinner";
import { animations } from "../lib/animations";
import { getDifficultyColor } from "@/app/lib/utils";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  solutionsCount: number;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      animations.modalIn('.search-modal');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  const searchChallenges = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/challenges/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.data || []);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchChallenges(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex mt-[20vh] justify-center p-4 h-[100vh]">
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm h-[100vh]" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl mx-4 max-h-[80vh] search-modal">
        <Card className="shadow-2xl flex flex-col pb-1 pt-2">
          <div className="flex items-center gap-3 p-4 border-b">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search challenges..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border-0 shadow-none focus-visible:ring-0"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 min-h-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                <Spinner className="mx-auto mb-2" />
                Searching...
              </div>
            ) : results.length === 0 && query ? (
              <div className="p-8 text-center text-muted-foreground">
                No challenges found for &quot;{query}&quot;
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Start typing to search challenges...
              </div>
            ) : (
              <div className="py-2">
                {results.map((challenge, index) => (
                  <Link
                    key={challenge.id}
                    href={`/challenges/${challenge.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors group card-hover"
                    data-animate="fadeInUp"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-shrink-0">
                      <FileText className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">
                          {challenge.title}
                        </h3>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {challenge.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{challenge.solutionsCount} solutions</span>
                        {challenge.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="p-3 border-t flex-shrink-0">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Press <kbd className="px-1 py-0.5 bg-muted rounded text-foreground">Esc</kbd> to close</span>
              <span>↑↓ to navigate • Enter to select</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
