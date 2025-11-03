import { database } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

// GET /api/challenges/:id - Get challenge by ID with solution count
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const challenge = await database.challenge.findUnique({
      where: { id },
      include: {
        _count: {
          select: { solutions: true },
        },
      },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...challenge,
      solutionsCount: challenge._count.solutions,
    });
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenge" },
      { status: 500 }
    );
  }
}




