import { database } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

// GET /api/challenges - Get paginated list of challenges
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20", 10);
    const search = searchParams.get("search") || "";
    const difficulty = searchParams.get("difficulty") || "";
    const sort = searchParams.get("sort") || "createdAt";
    const order: "asc" | "desc" = searchParams.get("order") as "asc" | "desc" || "desc";

    const skip = (page - 1) * pageSize;

    const where = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(difficulty && { difficulty }),
    };

    let challenges;
    let total;

    if (sort === "solutions") {
      const allChallenges = await database.challenge.findMany({
        where,
        include: {
          _count: {
            select: { solutions: true },
          },
        },
      });

      allChallenges.sort((a, b) => {
        const aCount = a._count.solutions;
        const bCount = b._count.solutions;
        return order === "asc" ? aCount - bCount : bCount - aCount;
      });

      total = allChallenges.length;
      const start = skip;
      const end = skip + pageSize;
      challenges = allChallenges.slice(start, end);
    } else {
      const orderBy: { title?: "asc" | "desc", difficulty?: "asc" | "desc", createdAt?: "asc" | "desc" } = {};
      if (sort === "title") {
        orderBy.title = order;
      } else if (sort === "difficulty") {
        orderBy.difficulty = order;
      } else {
        orderBy.createdAt = order;
      }

      [challenges, total] = await Promise.all([
        database.challenge.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
          include: {
            _count: {
              select: { solutions: true },
            },
          },
        }),
        database.challenge.count({ where }),
      ]);
    }

    return NextResponse.json({
      data: challenges.map((challenge) => ({
        ...challenge,
        solutionsCount: challenge._count.solutions,
      })),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching challenges:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json(
      { 
        error: "Failed to fetch challenges",
        message: errorMessage,
        ...(process.env.NODE_ENV === "development" && { stack: errorStack })
      },
      { status: 500 }
    );
  }
}




