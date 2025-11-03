import { database } from "@/app/database";
import { notFound } from "next/navigation";
import { SolutionEditor } from "./solution-editor";

async function getChallenge(id: string) {
  const challenge = await database.challenge.findUnique({
    where: { id },
  });

  return challenge;
}

export default async function SolveChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challenge = await getChallenge(id);

  if (!challenge) {
    notFound();
  }

  return <SolutionEditor challenge={challenge} />;
}




