"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { updateProfileField } from "../../lib/actions";

type EditableFieldProps = {
  id: string;
  fieldname: string;
  iconSrc: string;
  label: string;
  value: string;
  dir?: "ltr" | "rtl" | "auto";
  valueClassName?: string;
  table: string;
};

export default function EditableField({
  id,
  fieldname,
  iconSrc,
  label,
  value,
  dir = "rtl",
  valueClassName = "",
  table,
}: EditableFieldProps) {

  const [localValue, setLocalValue] = useState<string>(value);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const saveField = () => {
    setError("");
    startTransition(async () => {
      const result = await updateProfileField({
        table,
        id,
        field: fieldname,
        value: value,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }
      setIsEditing(false);
    });
  };

  return (
    <div className="flex flex-row justify-between items-center gap-3 w-full">
      <div className="flex flex-row items-center gap-2">
        <Image src={iconSrc} alt={fieldname} width={20} height={20} className="shrink-0" />
        <h5 className="block">{label}</h5>
      </div>

      {isEditing ? (
        <input
          dir={dir}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className={`border border-gray-300 rounded px-2 py-1 text-sm`}
        />
      ) : (
        <p dir={dir} className={valueClassName}>
          {localValue}
        </p>
      )}

      <button
        type="button"
        onClick={isEditing ? saveField : () => setIsEditing(true)}
        disabled={isPending}
      >
        <Image
          src={isEditing ? "/save.svg" : "/edit.svg"}
          alt={isEditing ? "Save" : "Edit"}
          width={20}
          height={20}
        />
      </button>
    </div>
  );
}
