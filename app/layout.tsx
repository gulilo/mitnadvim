import type { Metadata } from "next";
import { Noto_Sans_Hebrew } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/header";
import RtlProvider from "@/app/components/providers/rtl-provider";

const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ["hebrew", "latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MDA Mitnavim Dan",
  description: "MDA Mitnavim Dan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={notoSansHebrew.variable}>
      <body>
        <RtlProvider>
          {/* <Header /> */}
        <div>  {/* <div className="h-screen bg-gray-200 border-1 rounded-lg m-6 "> */}
            {children}
          </div>
        </RtlProvider>
      </body>
    </html>
  );
}
