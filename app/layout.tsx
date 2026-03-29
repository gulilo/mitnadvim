import type { Metadata } from "next";
import { Noto_Sans_Hebrew } from "next/font/google";
import "./globals.css";
import MainMenu from "./components/layout/mainMenu";
import { auth } from "@/auth";
import { DirectionProvider } from "./components/ui/direction";

const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ["hebrew", "latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MDA Mitnavim Dan",
  description: "MDA Mitnavim Dan",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="he" dir="rtl" className={notoSansHebrew.variable}>
      <body className="relative">
        <DirectionProvider dir="rtl" >
        {session && <MainMenu />}
        {children}
        </DirectionProvider>
      </body>
    </html>
  );
}
