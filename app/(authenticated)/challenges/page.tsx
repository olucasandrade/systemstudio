import { ChallengesListClient } from "./challenges-list-client";
import { createMetadata } from "@/app/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "System Design Challenges",
  description: "Browse and solve system design challenges. Practice real-world system design problems with different difficulty levels - Easy, Medium, and Hard.",
  url: "/challenges",
  keywords: [
    "system design challenges",
    "system architecture",
    "coding challenges",
    "software engineering",
    "distributed systems",
    "technical interview preparation",
  ],
});

export default function ChallengesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8" data-animate="fadeInUp">
        <h1 className="mb-2 text-3xl font-bold">System Design Challenges</h1>
        <p className="text-muted-foreground">
          Practice system design by solving real-world problems
        </p>
      </div>

      <ChallengesListClient />
    </div>
  );
}



