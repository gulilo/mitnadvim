import { cn } from "@/app/lib/utils";
import { getTagCategory, getTagName } from "../data/user";
export default async function Tags({ tagsids }: { tagsids: string[] }) {
  console.log(tagsids);
  const tagCategories = await Promise.all(
    tagsids.map(async (tagId) => {
      return await getTagCategory(tagId);
    })
  );
  console.log(tagCategories);
  const tagNames = await Promise.all(
    tagsids.map(async (tagId) => {
      return await getTagName(tagId);
    })
  );
  console.log(tagNames);
  const tags = tagNames.map((tagName, index) => {
    return {
      name: tagName,
      category: tagCategories[index],
    };
  });
  console.log(tags);
  return (
    <div>
      {/* Tags */}
      <div className="flex flex-wrap gap-2 justify-start mb-4">
        {tags.map((tag) => {
          let bgColor = null;
          let textColor = "text-black";
          let height = "h-7";
          let border = null;

          if (tag.category === "גזרה") {
            bgColor = cn("bg-tag-gizra");
          } else if (tag.category === "גיל") {
            bgColor = cn("bg-tag-age");
            textColor = "text-white";
          } else if (tag.category === "סאאוס") {
            bgColor = cn("bg-tag-status");
          }else if (tag.category === "אטן") {
            bgColor = cn("bg-tag-atn");
          }else if (tag.category === "ניהול") {
            border = cn("border-2 border-tag-gizra");
          }

          return (
            <h5
              key={tag.name}
              className={cn(
                "px-3 rounded flex items-center",
                bgColor,
                textColor,
                height,
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
