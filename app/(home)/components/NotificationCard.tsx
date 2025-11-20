import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type NotificationCardProps = {
  header: ReactNode;
  date: string;
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
  children,
  leading,
  trailing,
  className,
}: NotificationCardProps) {
  return (
    <Card className={cn("pb-1",className)}>
      <CardHeader>
        <CardTitle>{header}</CardTitle>
        <CardDescription>{date}</CardDescription>
        <CardAction>
        <div className="flex flex-row h-full">
          <Button className="justify-end" variant="ghost" size="icon">
            <img src="./icon_delete.svg" alt="delete" />
          </Button>
        </div>
      </CardAction>
      </CardHeader>
      <CardContent>{text}</CardContent>
    </Card>
  );
}
