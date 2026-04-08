import { user_info } from "@prisma/client";
import { Cross } from "lucide-react";
import Image from "next/image";

export default function UserRoleIcon({ user }: { user: user_info }) {
  return (
    <div>
      <Cross className="w-6 h-6 text-black" />
    </div>
  );
}