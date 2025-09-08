"use client";

import AnimatedBackground from "@/components/AnimatedBackground";
import { SignUp } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  return (
    <>
      <AnimatedBackground />
      <main className="relative z-10 flex justify-center items-center h-screen">
        <div className="flex-center h-screen w-full">
          <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
        </div>
      </main>
    </>
  );
};

export default Page;
