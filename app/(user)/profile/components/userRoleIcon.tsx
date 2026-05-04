import { tag, user_info } from "@prisma/client";
import { Cross } from "lucide-react";
import Image from "next/image";

const roledir = "roleIcons/";

type RoleIconConfig = {
  default: string;
  tags?: Partial<Record<string, string>>;
};

export const iconMap: Record<string, RoleIconConfig> = {
  "מגיש עזרה ראשונה": {
    default: '/medic_youth.svg',
    tags: {
      "חונך": '/medic_youth_mentor.svg',
      "חניך": '/medic_youth_mentee.svg',
    },
  },
  "מגישת עזרה ראשונה": {
    default: '/medic_youth.svg',
    tags: {
      "חונך": '/medic_youth_mentor.svg',
      "חניך": '/medic_youth_mentee.svg',
    },
  },
  "חובש רפואת חירום": {
    default: '/medic_adult.svg',
    tags: {
      "חובש משתלם": '/medic_student.svg',
    },
  },
  "חובשת רפואת חירום": {
    default: '/medic_adult.svg',
    tags: {
      "חובשת משתלמת": '/medic_student.svg',
    },
  },
  "פאראמדיק": {
    default: '/paramedic_assigned.svg',
  },
  "פאראמדיקית": {
    default: '/paramedic_assigned.svg',
  },
  "נהג-חובש": {
    default: '/avatar_driver_default_assigned.svg',
    tags: {
      "משתלם נהיגה": '/medic_adult_driving_student.svg',
    },
  },
  "נהגת-חובשת": {
    default: '/avatar_driver_default_assigned.svg',
    tags: {
      "משתלם נהיגה": '/medic_adult_driving_student.svg',
    },
  },
};


function getRoleIcon(role: string, tags: tag[]) {
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
  return (roledir + roleConfig?.default) || null;
}

export default function UserRoleIcon({ user, tags }: { user: user_info, tags: tag[] }) {
  const role = user.role;
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