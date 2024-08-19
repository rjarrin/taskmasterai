"use client";
import { signOutAction } from "@/actions/auth-actions";
import defaultUser from "@/public/account.svg";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function UserProfile() {
    // Use the useSession hook to get the current session data
    const session = useSession();
    // Determine the user's image URL based on the session data, fallback to defaultUser if not available
    const imageUrl = session?.data?.user?.image || defaultUser;
    // Extract the user's name and email from the session data
    const name = session?.data?.user?.name;
    const email = session?.data?.user?.email;

    return (
        <DropdownMenu>
            {/* Trigger for opening the dropdown menu */}
            <DropdownMenuTrigger asChild className="hover:cursor-pointer">
                <Button variant={"secondary"} className="flex items-center justify-start gap-1 lg:gap-2 m-0 p-0 lg:px-3 lg:w-full bg-white">
                    {/* Display the user's profile picture and email */}
                    <Image src={imageUrl} width={24} height={24} alt={`${name} profile picture`} className="rounded-full" />
                    <p className="truncate">{email}</p>
                </Button>
            </DropdownMenuTrigger>
            {/* Content of the dropdown menu */}
            <DropdownMenuContent className="w-56">
                {/* Dropdown menu item for signing out */}
                <DropdownMenuItem className="lg:w-full px-28 flex items-center justify-center">
                    <form action={signOutAction}>
                        <Button type="submit" variant={"ghost"} className="hover:text-primary">Sign out</Button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
