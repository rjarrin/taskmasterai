import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";

const defaultFont = Noto_Sans_Georgian({ subsets: ["latin"] });

const ORIGIN_URL = process.env.NODE === "production" ? "https://taskmaster.ai" : "http://localhost:3000";

export const metadata: Metadata = {
    title: "Task Master AI: Your Intelligent Personal Organizer",
    description:
        "Effortlessly manage your to-do list with cutting-edge artificial intelligence. This innovative app not only keeps your tasks neatly arranged but also anticipates your next moves, offering smart suggestions to boost your productivity.",
    icons: {
        icon: "/task.ico",
    },
    metadataBase: new URL(ORIGIN_URL),
    alternates: {
        canonical: ORIGIN_URL,
    },
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="en">
            <body className={defaultFont.className}>
                {children}
                <Toaster />
            </body>
        </html>
    );
}
