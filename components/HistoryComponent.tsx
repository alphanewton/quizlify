import { prisma } from "@/lib/db";
import { categoryMap } from "@/schemas/form/quiz";
import { BookOpen, ClockIcon, CopyCheck, Edit2 } from "lucide-react";
import Link from "next/link";
import React from "react";

async function HistoryComponent({
  limit,
  userId,
}: {
  limit: number;
  userId: string;
}) {
  const games = await prisma.game.findMany({
    where: { userId },
    take: limit,
    orderBy: {
      timeStarted: "desc",
    },
  });

  return (
    <div className="space-y-8">
      {games.map((game) => {
        return (
          <div className="flex items-center justify-between" key={game.id}>
            <div className="flex items-center">
              {game.gameType === "multiple" ? (
                <CopyCheck className="mr-3" />
              ) : (
                <BookOpen className="mr-3" />
              )}

              <div className="ml-4 space-y-1">
                <Link
                  href={`/statistics/${game.id}`}
                  className="text-base font-medium leading-none underline"
                >
                  {categoryMap.get(parseInt(game.category))!.name}
                </Link>

                <p className="flex items-center px-2 py-1 text-sm text-white rounded-lg w-fit bg-slate-800">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {new Date(game.timeStarted).toLocaleString()}
                </p>

                <p className="text-sm text-muted-foreground">
                  {game.gameType === "multiple" ? "MCQ" : "True/False"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HistoryComponent;
