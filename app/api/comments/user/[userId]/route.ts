import { database } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

// GET /api/comments/user/:userId - Get comments by user
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

    const [comments, total] = await Promise.all([
      database.comment.findMany({
        where: { userId },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          solution: {
            select: {
              id: true,
              challenge: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      }),
      database.comment.count({ where: { userId } }),
    ]);

    return NextResponse.json({
      data: comments,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching user comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}




