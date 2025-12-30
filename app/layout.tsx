import type { Metadata } from "next";
import { Noto_Sans_Hebrew } from "next/font/google";
import "./globals.css";
import RtlProvider from "@/app/components/providers/rtl-provider";
import MainMenu from "./components/layout/mainMenu";
import { auth } from "@/auth";

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
        <RtlProvider>
          {session && <MainMenu />}
          {children}
        </RtlProvider>
      </body>
    </html>
  );
}
