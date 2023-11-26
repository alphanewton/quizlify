import { getAuthSession } from "@/lib/nextauth";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request, res: Response) {
  try {
    // const session = await getAuthSession();
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: "You must be logged in to create a quiz" },
    //     { status: 401 }
    //   );
    // }

    const body = await req.json();
    const { amount, category, type } = quizCreationSchema.parse(body);

    let url = `https://opentdb.com/api.php?amount=${amount}&type=${type}&category=${category}`;

    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json({ questions: data }, { status: 200 });
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
