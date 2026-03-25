"use client";

import { DirectionProvider } from "../ui/direction";

type RtlProviderProps = {
  children: React.ReactNode;
};

export default function RtlProvider({ children }: RtlProviderProps) {
  return <DirectionProvider dir="rtl">{children}</DirectionProvider>;
}
