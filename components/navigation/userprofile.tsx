"use client";
import { useSession } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "../ui/dropdown-menu";
import Image from "next/image";
import defaultUser from "@/public/account.svg";
import { Button } from "../ui/button";
import { signOutAction } from "@/actions/auth-actions";

export default function UserProfile() {
    const session = useSession();
    const userImage = session?.data?.user?.image || defaultUser;
    const name = session?.data?.user?.name;
    const email = session?.data?.user?.email;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="hover:cursor-pointer">
                <Button variant={"secondary"} className="flex items-center justify-start gap-1 lg:gap-2 m-0 p-0 lg:px-3 lg:w-full bg-white">
                    <Image src={userImage} width={24} height={24} alt="userprofile image" className="rounded-full" />
                    <p className="truncate">{email}</p>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuItem className="lg:w-full px-28 flex items-center justify-center">
                    <form action={signOutAction}>
                        <Button type="submit" variant={"ghost"} className="hover:text-primary">Sign Out</Button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

