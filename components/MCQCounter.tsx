import React from "react";
import { Card } from "./ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { Separator } from "./ui/separator";

function MCQCounter({
  correctAns,
  wrongAns,
}: {
  correctAns: number;
  wrongAns: number;
}) {
  return (
    <Card className="flex flex-row items-center justify-center p-2">
      <CheckCircle2 color="green" size={30} />
      <span className="mx-2 text-2xl text-[green]">{correctAns}</span>
      <Separator orientation="vertical" />
      <span className="mx-2 text-2xl text-[red]">{wrongAns}</span>
      <XCircle size={30} color="red" />
    </Card>
  );
}

export default MCQCounter;
