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
    <Card className={cn("pb-1", className)}>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardTitle>{header}</CardTitle>
          <CardDescription>{date}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>{text}</CardContent>
      <CardFooter>
        <CardAction>
          <div className="flex flex-row w-full">
            <Button className="justify-end" variant="ghost" size="icon">
              <img src="./icon_delete.svg" alt="delete" />
            </Button>
          </div>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
