import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

import { cn } from "@/app/lib/utils";
import type { ReactNode } from "react";
import Image from "next/image";

type NotificationCardProps = {
  header: ReactNode;
  date: ReactNode;
  text: ReactNode;

  children: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  className?: string;
};

export default function NotificationCard({
  header,
  date,
  text,
  className,
}: NotificationCardProps) {
  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-row items-center justify-between">
        <p className="text-sm font-bold">{header}</p>
        <p className="mt-1 text-[10px] text-[#666]">{date}</p>
      </div>
      <div className="flex flex-row w-full">
        <Button className="justify-end" variant="ghost" size="icon">
          <Image src="./icon_delete.svg" alt="delete" width={20} height={20} />
        </Button>
      </div>
    </div>
  );
}
