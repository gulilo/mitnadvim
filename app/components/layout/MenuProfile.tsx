import Image from "next/image";
import { User } from "lucide-react";
import Tags from "@/app/(user)/components/tags";
import HomeStation from "@/app/(user)/components/homeStation";
import { ProfileData } from "@/app/(user)/lib/actions";
import { getDisplayTags } from "@/app/(user)/data/user";

export default async function MenuProfile({ profileData }: { profileData: ProfileData }) {
  const { user, areaName, tags } = profileData;
  const displayTags = await getDisplayTags(tags);
  return (
    <div className="flex flex-row justify-center gap-2">
      <div className="relative max-w-20 max-h-20 min-w-20 min-h-20 m-3">
        {user.image_url ? (
          <Image
            src={user.image_url}
            alt="profile image"
            width={12}
            height={12}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-300">
            <User className="w-full h-full text-gray-500" />
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center gap-2">
        <p>
          {user?.first_name} {user?.last_name}
        </p>

        <Tags tags={displayTags} />
        <HomeStation areaName={areaName || ""} />
      </div>
    </div>
  );
}
