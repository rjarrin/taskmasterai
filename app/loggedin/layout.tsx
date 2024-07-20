import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Providers from "@/app/providers";
import { useSession } from "next-auth/react";
import { auth } from "@/auth";


export default async function LoggedInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const session = await auth();
  return (
    <Providers session={session}>{children}</Providers>
  );
}
