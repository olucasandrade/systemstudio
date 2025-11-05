"use client";

import { JSONValue } from "@excalidraw/excalidraw/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  upvotesCount: number;
  downvotesCount: number;
  createdAt: string;
  updatedAt: string;
  solutionsCount: number;
}

interface ChallengesResponse {
  data: Challenge[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function useChallenges(
  page = 1,
  pageSize = 20,
  sort = "createdAt",
  order = "desc"
) {
  return useQuery({
    queryKey: ["challenges", page, pageSize, sort, order],
    queryFn: async (): Promise<ChallengesResponse> => {
      const response = await fetch(
        `${baseUrl}/api/challenges?page=${page}&pageSize=${pageSize}&sort=${sort}&order=${order}`
      );
      if (!response.ok) throw new Error("Failed to fetch challenges");
      return response.json();
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useChallenge(id: string) {
  return useQuery({
    queryKey: ["challenge", id],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/api/challenges/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error("Failed to fetch challenge");
      }
      return response.json();
    },
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function usePrefetchChallenge() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ["challenge", id],
      queryFn: async () => {
        const response = await fetch(`${baseUrl}/api/challenges/${id}`);
        if (!response.ok) {
          if (response.status === 404) return null;
          throw new Error("Failed to fetch challenge");
        }
        return response.json();
      },
      staleTime: 60 * 1000,
    });
  };
}

export interface Solution {
  id: string;
  challengeId: string;
  userId: string;
  description: string;
  canvasData: JSONValue | null;
  upvotesCount: number;
  downvotesCount: number;
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
  user: {
    firstName: string;
    lastName: string;
    imageUrl: string;
  };
}

export function useSolutions(challengeId: string, sortBy: string = "newest") {
  return useQuery({
    queryKey: ["solutions", challengeId, sortBy],
    queryFn: async (): Promise<Solution[]> => {
      const response = await fetch(
        `${baseUrl}/api/solutions/challenge/${challengeId}?sortBy=${sortBy}`
      );
      if (!response.ok) throw new Error("Failed to fetch solutions");
      const res = await response.json();
      return res.data;
    },
    enabled: !!challengeId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useSolution(id: string) {
  return useQuery({
    queryKey: ["solution", id],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/api/solutions/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error("Failed to fetch solution");
      }
      return response.json();
    },
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
}

