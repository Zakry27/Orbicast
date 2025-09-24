"use client";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Header from "./Header";
import Carousel from "./Carousel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import LoaderSpinner from "./LoaderSpinner";
import { useAudio } from "@/providers/AudioProvider";
import { cn } from "@/lib/utils";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, OctagonAlert } from "lucide-react";

const RightSidebar = () => {
  const { user } = useUser();
  const [success, setSuccess] = useState(false);
  const displayName = user?.username || user?.fullName || "Anonymous";

  const topPodcasters = useQuery(api.users.getTopUserByPodcastCount);
  const dbUser = useQuery(api.users.getUserById, { clerkId: user?.id || "" });

  const becomeCreatorMutation = useMutation(api.users.becomeCreator);
  const router = useRouter();
  const { audio } = useAudio();

  const role = dbUser?.role || "listener"; // role comes from convex DB

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (!topPodcasters) return <LoaderSpinner />;

  const handleBecomeCreator = async () => {
    await becomeCreatorMutation({ clerkId: user!.id });

    await fetch("/api/update-role", {
      method: "POST",
      body: JSON.stringify({
        clerkId: user!.id,
        role: "creator",
      }),
    });

    setSuccess(true);
    router.refresh();
  };

  return (
    <section
      className={cn("right_sidebar h-[calc(100vh-5px)]", {
        "h-[calc(100vh-80px)]": audio?.audioUrl,
      })}
    >
      <SignedIn>
        <Link href={`/profile/${user?.id}`} className=" flex gap-3 pb-12">
          <UserButton />
          <div className="flex w-full items-center justify-between">
            <h1 className="text-16 truncate font-semibold text-white-1">
              {displayName}
            </h1>
            <Image
              src="/icons/right-arrow.svg"
              alt="arrow"
              width={24}
              height={24}
            />
          </div>
        </Link>
      </SignedIn>
      <section>
        <Header headerTitle="Fans like you" />
        <Carousel fansLikeDetail={topPodcasters!} />
      </section>
      <section className="flex flex-col gap-8 pt-12">
        <Header headerTitle="Top users" />
        <div className="flex flex-col gap-6">
          {topPodcasters?.slice(0, 4).map((podcaster) => (
            <div
              key={podcaster._id}
              className="flex cursor-pointer justify-between"
              onClick={() => router.push(`/profile/${podcaster.clerkId}`)}
            >
              <figure className="flex items-center gap-2">
                <Image
                  src={podcaster.imageUrl}
                  alt={podcaster.name}
                  width={44}
                  height={44}
                  className="aspect-square rounded-lg"
                />
                <h2 className="text-14 font-semibold text-white-1">
                  {podcaster.name}
                </h2>
              </figure>
              <div className="flex items-center">
                <p className="text-12 font-normal text-white-1">
                  {podcaster.totalPodcasts} podcasts
                </p>
              </div>
            </div>
            // this is for the alert dialog / button to create be a creator
          ))}
        </div>
      </section>
      {user && role !== "creator" && !success && (
        <section className="mt-8">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="default"
                className="text-16 w-full bg-transparent py-4 font-extrabold text-white-1 transition-all duration-500 hover:text-orange-1"
              >
                Become a Creator
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-black-1 border-gray-1 text-white-1 ">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-bold tracking-tight">
                  Confirm Upgrade
                </AlertDialogTitle>
                <AlertDialogDescription className="mt-3! text-[15px] text-gray-1">
                  Are you sure you want to become a creator? This will unlock
                  podcast creation features.
                </AlertDialogDescription>
                <div className="mt-6! flex flex-wrap gap-2">
                  <Badge variant="outline" className="py-1 border-gray-1">
                    Podcast creation features
                  </Badge>
                  <Badge variant="outline" className="py-1 border-gray-1">
                    Advanced Blocks
                  </Badge>
                  <Badge variant="outline" className="py-1 border-gray-1">
                    Other Improvements
                  </Badge>
                  <Badge variant="outline" className="py-1 border-gray-1">
                    + much more
                  </Badge>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel className="border-gray-1">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleBecomeCreator}
                  className="flex items-center gap-2 bg-white-1 text-black-1 hover:bg-white-2"
                >
                  <Rocket />
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      )}
      {/* alert for success */}
      {success && (
        <div className="w-full space-y-4 mt-6">
          <Alert className="bg-emerald-500/10 dark:bg-emerald-600/30 text-emerald-500 border-none">
            <OctagonAlert className="h-4 w-4" />
            <AlertTitle>Congrats! You are now a Creator 🎉</AlertTitle>
          </Alert>
        </div>
      )}
    </section>
  );
};

export default RightSidebar;
