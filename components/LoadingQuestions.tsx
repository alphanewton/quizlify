"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Progress } from "./ui/progress";

const loadingTexts = [
  "Generating questions...",
  "Unleashing the power of curiosity...",
  "Diving deep into the ocean of questions..",
  "Harnessing the collective knowledge of the cosmos...",
  "Igniting the flame of wonder and exploration...",
];

function LoadingQuestions({ finished }: { finished: boolean }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(loadingTexts[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * loadingTexts.length);
      setLoadingText(loadingTexts[randomIdx]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (finished) return 100;
        if (prev === 100) return 0;
        if (Math.random() < 0.5) return prev + 2;
        return prev + 0.5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [finished]);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] md:w-[80vw] flex flex-col items-center">
      <Image
        src={"/loading.gif"}
        width={400}
        height={400}
        alt="loading animation"
      />
      <Progress value={progress} className="w-full mt-4" />
      <h1 className="mt-2 text-2xl">{loadingText}</h1>
    </div>
  );
}

export default LoadingQuestions;
