"use client";

import { cn } from "@/app/lib/utils";
import { DisplayTag } from "../data/definitions";

export default function Tags({ tags }: { tags: DisplayTag[] }) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Tags */}
      <div className="flex flex-wrap gap-2 justify-start mb-4">
        {tags.map((tag, index) => {
          return (
            <h5
              key={`${tag.name}-${index}`}
              className={cn(
                "px-3 rounded flex items-center h-7",
                tag.bgColor,
                tag.textColor,
                tag.border
              )}
            >
              {tag.name}
            </h5>
          );
        })}
      </div>
    </div>
  );
}
