import { ChallengeContent } from "./challenge-content";

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ChallengeContent challengeId={id} />;
}

