"use client";

import { Button } from "@/app/components/ui/button";
import type { ReactNode } from "react";
import Image from "next/image";
import { readNotification } from "../lib/action";
type NotificationCardProps = {
  id: string;
  header: ReactNode;
  date: ReactNode;
  text: ReactNode;
};

export default function NotificationCard({
  id,
  header,
  date,
  text,
}: NotificationCardProps) {
  return (
    <div className="grid grid-cols-4">
      <p className="col-span-3 text-sm font-bold">{header}</p>
      <p className="mt-1 text-[10px] text-[#666]">{date}</p>
      <p className="col-span-3 pl-5 text-sm">{text}</p>
      <div className="flex flex-row items-end justify-end">
        <Button variant="ghost" size="icon" onClick={() => readNotification(id)}>
          <Image src="/delete.svg" alt="delete" width={24} height={24} />
        </Button>
      </div>
    </div>
  );
}
