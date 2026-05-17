import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";
import { BoardProvider } from "@/context/BoardContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RoutineTrack - Task Manager",
  description: "A high-end, production-grade Task Management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body className={`${inter.className} antialiased`}>
        <BoardProvider>
          <AppLayout>{children}</AppLayout>
        </BoardProvider>
      </body>
    </html>
  );
}
