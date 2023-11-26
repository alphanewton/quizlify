import { checkAnswerSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { questionId, userAnswer } = checkAnswerSchema.parse(body);
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found!" },
        { status: 400 }
      );
    }

    const isCorrect = question.answer === userAnswer;
    await prisma.question.update({
      where: { id: questionId },
      data: {
        userAnswer,
        isCorrect,
      },
    });

    return NextResponse.json({ isCorrect }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
  }
}
