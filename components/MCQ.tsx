"use client";

import { categoryMap, checkAnswerSchema } from "@/schemas/form/quiz"; // Make sure this import is correct
import { Game, Question } from "@prisma/client";
import { Timer, ChevronRight, Loader2, BarChart2 } from "lucide-react";
import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import he from "he";
import { Button, buttonVariants } from "./ui/button";
import MCQCounter from "./MCQCounter";
import { useMutation } from "@tanstack/react-query";
import z from "zod";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import Link from "next/link";
import { cn, formatTimeDelta } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";

interface Props {
  game: Game & { questions: Pick<Question, "id" | "options" | "question">[] };
}

function MCQ({ game }: Props) {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [selectedChoice, setSelectedChoice] = React.useState(-1);
  const [isLoading, setLoading] = React.useState(false);
  const [correctAns, setCorrectAns] = React.useState(0);
  const [wrongAns, setWrongAns] = React.useState(0);
  const [hasEnded, setHasEnded] = React.useState(false);
  const [now, setNow] = React.useState(new Date());
  const { toast } = useToast();

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [hasEnded]);

  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const options = React.useMemo(() => {
    if (!currentQuestion || !currentQuestion.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  const { mutate: checkAnswer } = useMutation({
    mutationFn: async () => {
      setLoading(true);
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: options[selectedChoice],
      };
      const response = await axios.post("/api/checkAnswer", payload);
      setLoading(false);

      return response.data;
    },
  });

  const handleNext = React.useCallback(() => {
    if (isLoading) return;
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          toast({
            title: "Correct!",
            description: "Correct Answer",
            variant: "success",
          });
          setCorrectAns((prev) => prev + 1);
        } else {
          toast({
            title: "Incorrect!",
            description: "Incorrect Answer",
            variant: "destructive",
          });
          setWrongAns((prev) => prev + 1);
        }
        if (questionIndex === game.questions.length - 1) {
          setHasEnded(true);
        }
        setSelectedChoice(-1);
        setQuestionIndex((prev) => prev + 1);
      },
    });
  }, [checkAnswer, toast, isLoading]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key == "1") setSelectedChoice(0);
      else if (event.key == "2") setSelectedChoice(1);
      else if (event.key == "3") setSelectedChoice(2);
      else if (event.key == "4") setSelectedChoice(3);
      else if (event.key == "enter") handleNext();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleNext]);

  const categoryObject = categoryMap.get(parseInt(game.category));

  if (hasEnded)
    return (
      <div className="absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <div className="flex px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap p-3 items-center">
          You completed in{" "}
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          <BarChart2 className="w-4 h-4 ml-2" />
        </div>
        <Link
          href={`/statistics/${game.id}`}
          className={cn(buttonVariants(), "mt-2")}
        >
          View Statistics
        </Link>
      </div>
    );

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  max-w-4xl w-[90vw] md:w-[80vw] ">
      <div className="flex flex-row justify-between">
        {/* Topic */}
        <div className="flex flex-col">
          <p>
            <span className="text-slate-400">Topic: </span>
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800 ml-2">
              {categoryObject ? categoryObject.name : "Category not found"}
            </span>
          </p>
          <div className="flex self-start mt-3 text-slate-400">
            <Timer className="mr-2" />
            <span>
              {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
            </span>
          </div>
        </div>
        {/* MCQ counter */}
        <MCQCounter correctAns={correctAns} wrongAns={wrongAns} />
      </div>

      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {he.decode(currentQuestion.question)}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-col items-center justify-center w-full mt-4">
        {options.map((option, index) => {
          return (
            <Button
              key={index}
              className="w-full justify-start mb-4 py-8"
              variant={selectedChoice === index ? "default" : "secondary"}
              onClick={() => setSelectedChoice(index)}
            >
              <div className="flex items-center justify-start">
                <div className="p-2 px-3 mr-5 border rounded-md">
                  {index + 1}
                </div>
                <div className="text-start">{he.decode(option)}</div>
              </div>
            </Button>
          );
        })}

        <Button className="mt-2" onClick={handleNext} disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

export default MCQ;
