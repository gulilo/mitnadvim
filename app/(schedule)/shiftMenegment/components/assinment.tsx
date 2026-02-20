"use client"
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { DbUser } from "@/app/(user)/data/definitions";
import { DisplayShift } from "../../data/shift";
import { updateShiftDriver } from "../../lib/actions";

export default function Assinment({
  shift,
  onDriverAssigned,
}: {
  shift: DisplayShift;
  onDriverAssigned: (shiftId: string, driver: DbUser) => void;
}) {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<DbUser[]>([]);

  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (search.length < 2) {
      setResult([]);
      setIsSearchLoading(false);
      return;
    }
    setIsSearchLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(`/api/assinmentSearch?search=${search}`);
        const data = await response.json();
        setResult(data);
      } finally {
        setIsSearchLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(timeout);
      setIsSearchLoading(false);
    };
  }, [search]);

  const handleAssign = async (user: DbUser) => {
    setUpdatingUserId(user.id);
    try {
      await updateShiftDriver(shift.id, user.account_id);
      onDriverAssigned(shift.id, user);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const isUpdating = updatingUserId !== null;

  return (
    <div className="flex flex-col gap-2 min-w-48">
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        disabled={isUpdating}
        className="border rounded px-2 py-1"
      />

      {isSearchLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>טוען...</span>
        </div>
      )}

      {!isSearchLoading && search.length >= 2 && result.length === 0 && (
        <p className="text-sm text-muted-foreground">לא נמצאו תוצאות</p>
      )}

      <div className="flex flex-col gap-2">
        {result.map((user) => (
          <button
            key={user.id}
            onClick={() => handleAssign(user)}
            disabled={isUpdating}
            className="text-left px-2 py-1 rounded hover:bg-accent truncate disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updatingUserId === user.id ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                מעדכן...
              </span>
            ) : (
              <span>{user.first_name} {user.last_name}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}