"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { useAudio } from "@/providers/AudioProvider";

const LeftSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { audio } = useAudio();

  const { user } = useUser();

  // Fetch role from Convex
  const dbUser = useQuery(api.users.getUserById, { clerkId: user?.id || "" });
  const role = dbUser?.role || (user ? "listener" : "guest");

  // Role-based filtering
  const filteredLinks = sidebarLinks.filter(({ label }) => {
    if (role === "guest") {
      return ["Home", "Discover", "Profile"].includes(label);
    }
    if (role === "listener") {
      return ["Home", "Discover", "Library", "History", "Profile"].includes(
        label
      );
    }
    if (role === "creator") {
      return true; // all links
    }
    return false;
  });

  return (
    <section
      className={cn("left_sidebar h-[calc(100vh-5px)]", {
        "h-[calc(100vh-140px)]": audio?.audioUrl,
      })}
    >
      <nav className="flex flex-col gap-6">
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center"
        >
          <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
          <h1 className="text-24 font-extrabold text-white max-lg:hidden">
            Orbicast
          </h1>
        </Link>
        {filteredLinks.map(({ route, label, imgURL }) => {
          const isActive =
            pathname === route || pathname.startsWith("${route}/");

          return (
            <Link
              href={route}
              key={label}
              className={cn(
                "flex gap-3 items-center py-3 max-lg:px-4 justify-start transition-all",
                {
                  "bg-nav-focus text-[#688e26] pl-4": isActive,
                  "text-white-1": !isActive,
                }
              )}
            >
              <Image src={imgURL} alt={label} width={24} height={24} />
              <p>{label}</p>
            </Link>
          );
        })}
      </nav>
      <SignedOut>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button asChild className="text-16 w-full bg-orange-1 font-extrabold">
            <Link href="/sign-in" className="flex items-center gap-2">
              <Image
                src="/icons/login.svg"
                width={24}
                height={24}
                alt="login"
              />
              <span>Sign in</span>
            </Link>
          </Button>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button
            className="text-16 w-full bg-orange-1 font-extrabold flex items-center gap-2"
            onClick={() => signOut(() => router.push("/"))}
          >
            <Image
              src="/icons/logout.svg"
              width={24}
              height={24}
              alt="logout"
            />
            <span>Log out</span>
          </Button>
        </div>
      </SignedIn>
    </section>
  );
};

export default LeftSidebar;
