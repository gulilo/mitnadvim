"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import LaunchPointCell from "./launchPointCell";
import type { LaunchPoint } from "../../data/launchPoint";


export default function SortableLaunchPointsList({
  items,
}: {
  items: LaunchPoint[];
}) {
  const [ordered, setOrdered] = useState(items);

  useEffect(() => {
    setOrdered(items);
  }, [items]);

  async function saveOrderToDB(items: LaunchPoint[]) {
    await fetch("/api/launchPointReorder", {
      method: "POST",
      body: JSON.stringify({
        items: items.map((item, index) => ({
          id: item.id,
          order: index,
        })),
      }),
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ordered.findIndex((lp) => lp.id === active.id);
    const newIndex = ordered.findIndex((lp) => lp.id === over.id);
    const newOrdered = arrayMove(ordered, oldIndex, newIndex);
    setOrdered(newOrdered);
    saveOrderToDB(newOrdered);
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={ordered.map((lp) => lp.id)}
        strategy={verticalListSortingStrategy}
      >
        {ordered.map((lp) => (
          <LaunchPointCell
            key={lp.id}
            launchPoint={lp}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
