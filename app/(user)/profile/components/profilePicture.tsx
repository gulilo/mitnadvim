import { Camera, User } from "lucide-react";
import Image from "next/image";
import { user_info } from "@prisma/client";

export default function ProfilePicture({ user }: { user: user_info }) {
  return (
    <div className="relative max-w-[141px] max-h-[141px] min-w-[141px] min-h-[141px] mb-3">
    {user.image_url ? (
      <Image
        src={user.image_url}
        alt={`${user.first_name} ${user.last_name}`}
        fill
        className="rounded-full object-cover"
      />
    ) : (
      <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
        <User className="w-full h-full text-gray-500" />
      </div>
    )}
    <button className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center border-2 border-gray-200 shadow-sm">
      <Camera className="w-4 h-4 text-black" />
    </button>
  </div>
  );
}