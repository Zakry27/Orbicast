"use client";

import AnimatedBackground from "@/components/AnimatedBackground";
import { SignIn } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  return (
    <>
      <AnimatedBackground />
      <main className="relative z-10 flex justify-center items-center h-screen">
        <div className="flex-center h-screen w-full">
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        </div>
      </main>
    </>
  );
};

export default Page;
