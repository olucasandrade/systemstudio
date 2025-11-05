import { auth, clerkClient } from "@/app/auth/server";
import { database } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

// GET /api/solutions/:id - Get solution by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const solution = await database.solution.findUnique({
      where: { id },
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
    });

    if (!solution) {
      return NextResponse.json(
        { error: "Solution not found" },
        { status: 404 }
      );
    }

    const client = await clerkClient();
    const user = await client.users.getUser(solution.userId).catch(() => null);

    return NextResponse.json({
      ...solution,
      commentsCount: solution._count.comments,
      user: user
        ? {
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching solution:", error);
    return NextResponse.json(
      { error: "Failed to fetch solution" },
      { status: 500 }
    );
  }
}

// PUT /api/solutions/:id - Update solution (owner only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { description, canvasData } = body;

    const existingSolution = await database.solution.findUnique({
      where: { id },
    });

    if (!existingSolution) {
      return NextResponse.json(
        { error: "Solution not found" },
        { status: 404 }
      );
    }

    if (existingSolution.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only edit your own solutions" },
        { status: 403 }
      );
    }

    const solution = await database.solution.update({
      where: { id },
      data: {
        ...(description !== undefined && { description }),
        ...(canvasData !== undefined && { canvasData }),
      },
    });

    return NextResponse.json(solution);
  } catch (error) {
    console.error("Error updating solution:", error);
    return NextResponse.json(
      { error: "Failed to update solution" },
      { status: 500 }
    );
  }
}

// DELETE /api/solutions/:id - Delete solution (owner only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingSolution = await database.solution.findUnique({
      where: { id },
    });

    if (!existingSolution) {
      return NextResponse.json(
        { error: "Solution not found" },
        { status: 404 }
      );
    }

    if (existingSolution.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own solutions" },
        { status: 403 }
      );
    }

    await database.solution.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting solution:", error);
    return NextResponse.json(
      { error: "Failed to delete solution" },
      { status: 500 }
    );
  }
}




