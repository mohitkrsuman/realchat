import FriendRequests from "@/components/FriendRequests";
import { fetchRedis } from "@/helpers/helpers";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  // ids of people who sent current logged in user a friend request
  const incomingSenderIds = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  const incomingFriendRequest = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = (await fetchRedis("get", `user:${senderId}`)) as string;
      const senderParsed = JSON.parse(sender);
      return {
        senderId,
        senderEmail: senderParsed.email,
      };
    })
  );

  console.log(incomingFriendRequest);

  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Friend Requests</h1>
      <div className="flex flex-col gap-4"></div>
      <FriendRequests
        incomingFriendRequest={incomingFriendRequest}
        sessionId={session.user.id}
      />
    </main>
  );
};

export default page;
