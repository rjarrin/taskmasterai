"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { signInAction } from "@/actions/auth-actions";
import UserProfile from "@/components/navigation/userprofile";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1>Logged In</h1>
      
      <UserProfile />

      <div>
        <p>Tasks</p>
          {tasks?.map(({ _id, text }) => <p key={_id}>{JSON.stringify(text)}</p>)} 
      </div>
         
    </main>
  );
}
