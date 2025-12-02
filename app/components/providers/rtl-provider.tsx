"use client";

import { DirectionProvider } from "@radix-ui/react-direction";

type RtlProviderProps = {
  children: React.ReactNode;
};

export default function RtlProvider({ children }: RtlProviderProps) {
  return <DirectionProvider dir="rtl">{children}</DirectionProvider>;
}
