"use client";

import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

function SignInButton({ text }: { text: string }) {
  return (
    <Button
      onClick={() => {
        signIn("google").catch(console.error);
      }}
    >
      {text}
    </Button>
  );
}

export default SignInButton;
