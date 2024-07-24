"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { signInAction } from "@/actions/auth-actions";
import UserProfile from "@/components/navigation/userprofile";
import Sidebar from "@/components/navigation/sidebar";
import MobileNav from "@/components/navigation/mobilenav";
import githubLogo from "@/public/github.svg";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <MobileNav />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
          <div>
            <p>Tasks</p>
              {tasks?.map(({ _id, text }) => <p key={_id}>{JSON.stringify(text)}</p>)} 
          </div>
        </main>
      </div>
         
    </div>
  );
}
