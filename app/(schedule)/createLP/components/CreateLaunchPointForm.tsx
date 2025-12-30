"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLaunchPoint } from "../../lib/actions";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { DbArea } from "../../data/launchPoint";

interface CreateLaunchPointFormProps {
  areas: DbArea[];
}

export default function CreateLaunchPointForm({ areas }: CreateLaunchPointFormProps) {
  const [name, setName] = useState("");
  const [areaId, setAreaId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name || !areaId) {
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("areaId", areaId);
      await createLaunchPoint(formData);
      // Reset form
      setName("");
      setAreaId("");
      // Refresh the page to show the new launch point
      router.refresh();
    } catch (error) {
      console.error("Failed to create launch point:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 items-center">
        <label htmlFor="name" className="whitespace-nowrap min-w-[120px]">
          שם נקודת הזנקה:
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border-b-2 border-b-primary bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-0"
          placeholder="הכנס שם נקודת הזנקה"
        />
      </div>
      <div className="flex flex-row gap-4 items-center">
        <label htmlFor="areaId" className="whitespace-nowrap min-w-[120px]">
          אזור:
        </label>
        <Select value={areaId} onValueChange={setAreaId} required>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="בחר אזור" />
          </SelectTrigger>
          <SelectContent>
            {areas.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "שומר..." : "שמור נקודת הזנקה"}
      </Button>
    </form>
  );
}

