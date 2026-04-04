"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { LaunchPoint } from "../../data/launchPoint";
import DeleteLaunchPointButton from "./DeleteLaunchPointButton";
import Image from "next/image";
export default function LaunchPointCell({
  launchPoint,
}: {
  launchPoint: LaunchPoint;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: launchPoint.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-row justify-between items-center gap-2 w-full p-3 rounded-md border bg-background mb-2"
      {...attributes}
    >
      
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-medium">{launchPoint.name}</span>
      </div>
      <DeleteLaunchPointButton
        launchPointId={launchPoint.id}
        launchPointName={launchPoint.name}
      />
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing shrink-0 touch-none text-muted-foreground"
        aria-label="גרור לסידור"
        {...listeners}
      >
        <Image src="/Sort Icon.svg" alt="drag" width={20} height={20} />
      </button>
    </div>
  );
}