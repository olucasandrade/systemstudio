import { clerkClient } from "@/app/auth/server";
import { database } from "@/app/database";
import { NextResponse } from "next/server";

export async function GET() {
  const totalUsers = await (await clerkClient()).users.getCount();
  return NextResponse.json({
    totalUsers,
    totalChallenges: await database.challenge.count(),
    totalSolutions: await database.solution.count(),
  });
}