import { user_info } from "@prisma/client";
import { Cross } from "lucide-react";
import Image from "next/image";
import { getUserTags } from "../../data/user";
import { Tag } from "../../data/definitions";


type RoleIconConfig = {
  default: string;
  tags?: Partial<Record<string, string>>;
};

export const iconMap: Record<string, RoleIconConfig> = {
 "מגיש עזרה ראשונה": {
    default: '/roleIcons/icon_medic_youth.svg',
    tags: {
      "חונך": '/roleIcons/icon_medic_youth_mentor.svg',
      "חניך": '/roleIcons/icon_medic_youth_mentee.svg',
    },
  },
 "מגישת עזרה ראשונה": {
    default: '/roleIcons/icon_medic_youth.svg',
    tags: {
      "חונך": '/roleIcons/icon_medic_youth_mentor.svg',
      "חניך": '/roleIcons/icon_medic_youth_mentee.svg',
    },
  },
  "חובש רפואת חירום": {
    default: '/roleIcons/icon_medic_adult.svg',
    tags: {
      "חובש משתלם": '/roleIcons/icon_medic_student.svg',
    },
  },
  "חובשת רפואת חירום": {
    default: '/roleIcons/icon_medic_adult.svg',
    tags: {
      "חובשת משתלמת": '/roleIcons/icon_medic_student.svg',
    },
  },
  "פאראמדיק": {
    default: '/roleIcons/icon_paramedic_assigned.svg',
  },
  "פאראמדיקית": {
    default: '/roleIcons/icon_paramedic_assigned.svg',
  },
  "נהג-חובש": {
    default: '/roleIcons/icon_avatar_driver_default_assigned.svg',
    tags: {
      "משתלם נהיגה": '/roleIcons/icon_medic_adult_driving_student.svg',
    },
  },
  "נהגת-חובשת": {
    default: '/roleIcons/icon_avatar_driver_default_assigned.svg',
    tags: {
      "משתלם נהיגה": '/roleIcons/icon_medic_adult_driving_student.svg',
    },
  },
};


function getRoleIcon(role: string, tags: Tag[]) {
  const roleConfig = iconMap[role];
  if (!roleConfig) {
    return null;
  }

  if (roleConfig.tags) {
    for (const tag of tags) {
      const tagConfig = roleConfig.tags[tag.name];
      if (tagConfig) {
        return tagConfig;
      }
    }
  }
  return roleConfig?.default || null;
}

export default async function UserRoleIcon({ user }: { user: user_info }) {
  const role = user.role;
  const tags = await getUserTags(user.id);
  const iconPath = getRoleIcon(role ?? "", tags);
console.log("iconPath", iconPath);

  if (iconPath) {
    return (
      <Image
        src={iconPath}
        alt={role ?? "role icon"}
        width={36}
        height={36}
      />
    );
  }

  return (
    <div>
      <Cross className="w-6 h-6 text-black" />
    </div>
  );
}