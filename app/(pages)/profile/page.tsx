"use client";
import NavBar from "@/components/NavBar";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";
import Image from "next/image";
import { SignOutButton } from "@/components/authButtons";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<Session["user"] | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    if (session && session.user) {
      setUser(session.user);
    }

    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [session, status, router]);

  if (status === "loading" || !user) {
    return (
      <div className="h-screen">
        <NavBar />
        <div className="ml-8 pt-28">
          <ContentLoader
            height={140}
            speed={1}
            backgroundColor={"#333"}
            foregroundColor={"#999"}
            viewBox="0 0 380 70"
          >
            <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
            <rect x="80" y="17" rx="4" ry="4" width="150" height="13" />
            <rect x="80" y="40" rx="3" ry="3" width="200" height="10" />
          </ContentLoader>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <NavBar />
      <div className="ml-8 flex items-center pt-28">
        <div className="flex items-center">
          <Image
            src={user.image ?? "/logo.png"}
            alt="Profile Picture"
            width={110}
            height={110}
            className="mr-8 rounded-full"
          />
          <div>
            <h1 className="text-xl">{user.name}</h1>
            <p className="text-lg">{user.email}</p>
          </div>
        </div>

        <SignOutButton className="ml-12 rounded bg-cyan-700 px-6 py-2 text-white hover:bg-cyan-600" />
      </div>
    </div>
  );
}
