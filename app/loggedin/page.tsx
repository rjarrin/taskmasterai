"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { signInAction } from "@/actions/auth-actions";
import UserProfile from "@/components/navigation/userprofile";
import Sidebar from "@/components/navigation/sidebar";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <h1>Logged In</h1>
      
      <UserProfile />

      <div>
        <p>Tasks</p>
          {tasks?.map(({ _id, text }) => <p key={_id}>{JSON.stringify(text)}</p>)} 
      </div>
         
    </div>
  );
}
