"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React from "react";
import D3WordCloud from "react-d3-cloud";

const fontSizeMapper = (word: { value: number }) => {
  return Math.log2(word.value) * 5 + 16;
};

function CustomWordCloud({
  formattedTopics,
}: {
  formattedTopics: { text: string | undefined; value: number }[];
}) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <>
      <D3WordCloud
        height={550}
        data={formattedTopics as any}
        font="Times"
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        onWordClick={(event, word) => {
          router.push("/quiz");
        }}
        fill={theme.theme === "dark" ? "white" : "black"}
      />
    </>
  );
}

export default CustomWordCloud;
