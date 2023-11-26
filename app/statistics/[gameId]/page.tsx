import AccuracyCard from "@/components/statistics/AccuracyCard";
import QuestionList from "@/components/statistics/QuestionList";
import ResultsCard from "@/components/statistics/ResultsCard";
import TimeTakenCard from "@/components/statistics/TimeTakenCard";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  params: {
    gameId: string;
  };
}

async function StatisticsPage({ params: { gameId } }: Props) {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { questions: true },
  });
  if (!game) {
    return redirect("/quiz");
  }

  const totalCorrect = game.questions.reduce((acc, q) => {
    if (q.isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

  let accuracy = (totalCorrect / game.questions.length) * 100;
  accuracy = Math.round(accuracy * 100) / 100;

  return (
    <div className="p-8">
      <div className="p-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Statistics</h2>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className={buttonVariants()}>
              <LucideLayoutDashboard className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-4 mt-4 md:grid-cols-7">
          {/* ResultsCard */}
          <ResultsCard accuracy={accuracy} />
          {/* AccuracyCard */}
          <AccuracyCard accuracy={accuracy} />
          {/* TimeTakenCard */}
          <TimeTakenCard
            timeStarted={game.timeStarted}
            timeEnded={new Date()}
          />
        </div>

        {/* QuestionsList */}
        <QuestionList questions={game.questions} />
      </div>
    </div>
  );
}

export default StatisticsPage;
