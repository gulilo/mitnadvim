import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/layout/header";
import RtlProvider from "@/components/providers/rtl-provider";

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
    <html lang="he" dir="rtl">
      <body>
        <RtlProvider>
          {/* <Header /> */}
          <div className="h-screen bg-gray-200 border-1 rounded-lg m-6 ">
            {children}
          </div>
        </RtlProvider>
      </body>
    </html>
  );
}
