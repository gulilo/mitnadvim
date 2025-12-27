"use client";

import { useEffect, useState } from "react";
import { cn } from "@/app/lib/utils";
import { getTagsData } from "../lib/actions";

export default function Tags({ tagsids }: { tagsids: string[] }) {
  const [tags, setTags] = useState<
    Array<{ name: string | null; category: string | null }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      try {
        const data = await getTagsData(tagsids);
        setTags(data);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      } finally {
        setLoading(false);
      }
    }
    if (tagsids && tagsids.length > 0) {
      fetchTags();
    } else {
      setLoading(false);
    }
  }, [tagsids]);
  if (loading) {
    return <div>Loading tags...</div>;
  }

  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Tags */}
      <div className="flex flex-wrap gap-2 justify-start mb-4">
        {tags.map((tag, index) => {
          if (!tag.name) return null;
          let bgColor = null;
          let textColor = "text-black";
          let border = null;

          if (tag.category === "גזרה") {
            bgColor = cn("bg-tag-gizra");
          } else if (tag.category === "גיל") {
            bgColor = cn("bg-tag-age");
            textColor = "text-white";
          } else if (tag.category === "סאאוס") {
            bgColor = cn("bg-tag-status");
          } else if (tag.category === "אטן") {
            bgColor = cn("bg-tag-atn");
          } else if (tag.category === "ניהול") {
            border = cn("border-2 border-tag-gizra");
          }

          return (
            <h5
              key={`${tag.name}-${index}`}
              className={cn(
                "px-3 rounded flex items-center h-7",
                bgColor,
                textColor,
                border
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
