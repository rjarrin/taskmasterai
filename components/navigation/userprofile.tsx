"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import defaultUser from "@/public/account.svg";

export default function UserProfile() {
    const session = useSession();
    const userImage = session?.data?.user?.image || defaultUser;
    return (
        <div>
            <Image src={userImage} width={24} height={24} alt="userprofile image" className="rounded-full"></Image>
        </div>
    );
}