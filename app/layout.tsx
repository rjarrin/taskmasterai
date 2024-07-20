import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Master AI: Your Intelligent Personal Organizer",
  description: "Effortlessly manage your to-do list with cutting-edge artificial intelligence. This innovative app not only keeps your tasks neatly arranged but also anticipates your next moves, offering smart suggestions to boost your productivity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      {children}
      </body>
    </html>
  );
}
