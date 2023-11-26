import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import CustomWordCloud from "../CustomWordCloud";
import { prisma } from "@/lib/db";
import { categoryMap } from "@/schemas/form/quiz";

async function HotTopicsCard() {
  const topics = await prisma.topicCount.findMany({});
  const formattedTopics = topics.map((topic) => {
    return {
      text: categoryMap.get(parseInt(topic.topic))?.name,
      value: topic.count,
    };
  });

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Hot Topics</CardTitle>
        <CardDescription>
          Click on a topic to start a quiz on it!
        </CardDescription>
      </CardHeader>

      <CardContent className="pl-2">
        <CustomWordCloud formattedTopics={formattedTopics} />
      </CardContent>
    </Card>
  );
}

export default HotTopicsCard;
