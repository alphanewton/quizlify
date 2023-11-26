"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { quizCreationSchema, trivia_categories } from "@/schemas/form/quiz";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BookOpen, CopyCheck } from "lucide-react";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingQuestions from "./LoadingQuestions";

type Input = z.infer<typeof quizCreationSchema>;

function QuizCreation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  const { mutate: getQuestions } = useMutation({
    mutationFn: async ({ amount, category, type }: Input) => {
      const response = await axios.post("/api/game", {
        amount,
        category,
        type,
      });
      return response.data;
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      amount: 3,
      category: "",
      type: "multiple",
    },
  });

  function onSubmit(input: Input) {
    // alert(JSON.stringify(input, null, 0));
    setLoading(true);
    getQuestions(
      {
        amount: input.amount,
        category: input.category,
        type: input.type,
      },
      {
        onSuccess: ({ gameId }) => {
          setFinished(true);
          setTimeout(() => {
            router.push(`/play/${gameId}`);
          }, 1000);
        },
        onError: () => {
          setLoading(false);
        },
      }
    );
  }

  form.watch();

  if (loading) return <LoadingQuestions finished={finished} />;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-2xl">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      {/* <Input placeholder="Enter a topic..."  /> */}
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic..." />
                        </SelectTrigger>
                        <SelectContent>
                          {trivia_categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>Please provide a category</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter an amount..."
                        {...field}
                        type="number"
                        min={1}
                        max={10}
                        onChange={(e) =>
                          form.setValue("amount", parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={() => form.setValue("type", "multiple")}
                  className="w-1/2 rounded-none rounded-l-lg"
                  variant={
                    form.getValues("type") === "multiple"
                      ? "default"
                      : "secondary"
                  }
                >
                  <CopyCheck className="w-10 h-10 mr-2" /> Multiple Choice
                </Button>
                <Separator orientation="vertical" />

                <Button
                  type="button"
                  onClick={() => form.setValue("type", "boolean")}
                  className="w-1/2 rounded-none rounded-r-lg"
                  variant={
                    form.getValues("type") === "boolean"
                      ? "default"
                      : "secondary"
                  }
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  True or False
                </Button>
              </div>

              <Button disabled={loading} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default QuizCreation;
