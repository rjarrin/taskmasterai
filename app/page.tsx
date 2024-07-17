"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1>Hello World</h1>
      <Button>Click me</Button>
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}      
    </main>
  );
}
