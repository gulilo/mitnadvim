import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ShiftCardProps = {
  children: ReactNode;
  className?: string;
};

export default function ShiftCard({ children, className }: ShiftCardProps) {
  return (
    <Card
      className={cn(
        "!grid items-center !rounded-2xl border border-[#fcd1d1] bg-[#fffdfa] px-4 py-3 text-xs text-[#111] !shadow-none",
        className
      )}
    >
      {children}
    </Card>
  );
}
