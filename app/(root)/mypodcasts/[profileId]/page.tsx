// app/profile/[profileId]/podcasts/page.tsx
"use client";

import { useQuery } from "convex/react";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import { api } from "@/convex/_generated/api";

const MyPodcasts = ({ params }: { params: { profileId: string } }) => {
  const user = useQuery(api.users.getUserById, {
    clerkId: params.profileId,
  });
  const podcastsData = useQuery(api.podcasts.getPodcastByAuthorId, {
    authorId: params.profileId,
  });

  if (!user || !podcastsData) {
    return <LoaderSpinner />;
  }

  return (
    <section className="mt-9 flex flex-col gap-9 md:overflow-hidden">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">
          {user?.clerkId === params.profileId
            ? "My Podcasts"
            : `${user?.name}'s Podcasts`}
        </h1>

        {podcastsData.podcasts.length > 0 ? (
          <div className="podcast_grid">
            {podcastsData?.podcasts?.map((podcast) => (
              <PodcastCard
                key={podcast._id}
                imgUrl={podcast.imageUrl!}
                title={podcast.podcastTitle!}
                description={podcast.podcastDescription}
                podcastId={podcast._id}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="You haven’t created any podcasts yet"
            buttonLink="/create-podcast"
            buttonText="Start Creating"
          />
        )}
      </section>
    </section>
  );
};

export default MyPodcasts;
