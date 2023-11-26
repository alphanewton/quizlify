import QuizCreation from "@/components/QuizCreation";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Quiz | Quizlify",
};

async function QuizPage() {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }
  return (
    <div className="p-8">
      <QuizCreation />
    </div>
  );
}

export default QuizPage;
