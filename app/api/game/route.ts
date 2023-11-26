import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import axios from "axios";

export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in!" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { amount, category, type } = quizCreationSchema.parse(body);

    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: session.user.id,
        category,
      },
    });

    await prisma.topicCount.upsert({
      where: {
        topic: category,
      },
      create: {
        topic: category,
        count: 1,
      },
      update: {
        count: {
          increment: 1,
        },
      },
    });

    const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      category,
      type,
    });

    type mcqQuestion = {
      question: string;
      correct_answer: string;
      incorrect_answers: string[];
    };
    let manyData = data.questions.results.map((question: mcqQuestion) => {
      let options = [question.correct_answer, ...question.incorrect_answers];
      options = options.sort(() => Math.random() - 0.5);
      return {
        question: question.question,
        answer: question.correct_answer,
        options: JSON.stringify(options),
        gameId: game.id,
        questionType: type,
      };
    });

    await prisma.question.createMany({
      data: manyData,
    });

    return NextResponse.json({
      gameId: game.id,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    } else {
      // Handle other types of errors here and return a response
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}
