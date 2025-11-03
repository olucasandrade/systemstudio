import { database } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

// GET /api/solutions/user/:userId - Get solutions by user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20", 10);

    const skip = (page - 1) * pageSize;

    const [solutions, total] = await Promise.all([
      database.solution.findMany({
        where: { userId },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          challenge: {
            select: {
              id: true,
              title: true,
              difficulty: true,
            },
          },
          _count: {
            select: { comments: true },
          },
        },
      }),
      database.solution.count({ where: { userId } }),
    ]);

    return NextResponse.json({
      data: solutions.map((sol) => ({
        ...sol,
        commentsCount: sol._count.comments,
      })),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching user solutions:", error);
    return NextResponse.json(
      { error: "Failed to fetch solutions" },
      { status: 500 }
    );
  }
}




