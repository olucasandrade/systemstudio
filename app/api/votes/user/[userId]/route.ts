import { database } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

// GET /api/votes/user/:userId - Get all votes by a user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "50", 10);

    const skip = (page - 1) * pageSize;

    const [votes, total] = await Promise.all([
      database.vote.findMany({
        where: { userId },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      database.vote.count({ where: { userId } }),
    ]);

    return NextResponse.json({
      data: votes,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching user votes:", error);
    return NextResponse.json(
      { error: "Failed to fetch votes" },
      { status: 500 }
    );
  }
}




