import { database, Prisma } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const difficulty = searchParams.get("difficulty") || "";
    const sort = searchParams.get("sort") || "newest";

    const where: Prisma.ChallengeWhereInput = {};

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" as const } },
        { description: { contains: q, mode: "insensitive" as const } },
        { tags: { has: q } },
      ];
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    const orderBy: Prisma.ChallengeOrderByWithRelationInput = {};
    switch (sort) {
      case "newest":
        orderBy.createdAt = "desc";
        break;
      case "oldest":
        orderBy.createdAt = "asc";
        break;
      case "most_solutions":
        orderBy.solutions = { _count: "desc" };
        break;
      case "difficulty":
        orderBy.difficulty = "asc";
        break;
    }

    const challenges = await database.challenge.findMany({
      where,
      orderBy,
      take: 3,
      include: {
        _count: {
          select: { solutions: true },
        },
      },
    });

    const formattedChallenges = challenges.map((challenge) => ({
      ...challenge,
      solutionsCount: challenge._count.solutions,
    }));

    return NextResponse.json({ data: formattedChallenges });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search challenges" },
      { status: 500 }
    );
  }
}