import type { Prisma } from "@prisma/client";
import { account, emergency_contacts, tag, user_info } from "@prisma/client";
import { prisma } from "../../lib/data";
import { DisplayTag } from "./definitions";

export async function getUserByEmail(email: string): Promise<account | null> {
  try {
    console.log("email", email);
    return await prisma.account.findUnique({ where: { email } });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function getUserByPhone(phone: string): Promise<account | null> {
  try {
    return await prisma.account.findUnique({ where: { phone } });
  } catch (error) {
    console.error("Failed to fetch user by phone:", error);
    throw new Error("Failed to fetch user by phone.");
  }
}

export async function getUserByAccountId(
  accountId: string,
): Promise<user_info | null> {
  try {
    return await prisma.user_info.findUnique({
      where: { account_id: accountId },
    });
  } catch (error) {
    console.error("Failed to fetch user by account id:", error);
    throw new Error("Failed to fetch user by account id.");
  }
}

export async function getAccountByAccountId(
  accountId: string,
): Promise<account | null> {
  try {
    return await prisma.account.findUnique({ where: { id: accountId } });
  } catch (error) {
    console.error("Failed to fetch account:", error);
    throw new Error("Failed to fetch account.");
  }
}

export async function getEmergencyContactByUserId(
  userId: string,
): Promise<emergency_contacts | null> {
  try {
    return await prisma.emergency_contacts.findFirst({
      where: { user_info_id: userId },
    });
  } catch (error) {
    console.error("Failed to fetch emergency contact:", error);
    return null;
  }
}

export async function getAreaName(areaId: string): Promise<string | null> {
  try {
    return (
      (
        await prisma.area.findUnique({
          where: { id: areaId },
          select: { name: true },
        })
      )?.name ?? null
    );
  } catch (error) {
    console.error("Failed to fetch area:", error);
    throw new Error("Failed to fetch area.");
  }
}

export async function getUserTags(accountId: string): Promise<tag[]> {
  try {
    return await prisma.tag.findMany({
      where: { accountTags: { some: { account_id: accountId } } },
    });
  } catch (error) {
    console.error("Failed to fetch user tags:", error);
    throw new Error("Failed to fetch user tags.");
  }
}

export async function getTagName(tagId: string): Promise<string | null> {
  try {
    return (
      (
        await prisma.tag.findUnique({
          where: { id: tagId },
          select: { name: true },
        })
      )?.name ?? null
    );
  } catch (error) {
    console.error("Failed to fetch tag name:", error);
    throw new Error("Failed to fetch tag name.");
  }
}

export async function getTagCategory(tagId: string): Promise<string | null> {
  try {
    return (
      (
        await prisma.tag.findUnique({
          where: { id: tagId },
          select: { category: true },
        })
      )?.category ?? null
    );
  } catch (error) {
    console.error("Failed to fetch tag category:", error);
    throw new Error("Failed to fetch tag category.");
  }
}

export async function getUserPermissions(tags: tag[]): Promise<string[]> {
  try {
    if (!tags || tags.length === 0) {
      return [];
    }
    return (
      (
        await prisma.permissions.findMany({
          where: {
            tagPermissions: {
              some: { tag_id: { in: tags.map((tag) => tag.id) } },
            },
          },
          select: { name: true },
        })
      )?.map((permission) => permission.name) ?? []
    );
  } catch (error) {
    console.error("Failed to fetch user permissions:", error);
    throw new Error("Failed to fetch user permissions.");
  }
}

export async function getUsersByPartialName(
  name: string,
): Promise<user_info[]> {
  try {
    return (
      (await prisma.user_info.findMany({
        where: {
          OR: [
            { first_name: { contains: name, mode: "insensitive" } },
            { last_name: { contains: name, mode: "insensitive" } },
          ],
        },
        take: 10,
      })) ?? []
    );
  } catch (error) {
    console.error("Failed to fetch users by partial name:", error);
    throw new Error("Failed to fetch users by partial name.");
  }
}

export async function getAllTags(): Promise<tag[]> {
  try {
    return await prisma.tag.findMany({});
  } catch (error) {
    console.error("Failed to fetch all tags:", error);
    throw new Error("Failed to fetch all tags.");
  }
}

export async function getDisplayTags(tags: tag[]): Promise<DisplayTag[]> {
  try {
    const displayTags = [];
    for (const tag of tags) {
      if (!tag.name) continue;
      const displayTag: DisplayTag = {
        id: tag.id,
        name: tag.name,
        bgColor: "",
        textColor: "text-black",
        border: "",
      };

      if (tag.category === "גזרה") {
        displayTag.bgColor = "bg-tag-gizra";
      } else if (tag.category === "גיל") {
        displayTag.bgColor = "bg-tag-age";
        displayTag.textColor = "text-white";
      } else if (tag.category === "סאאוס") {
        displayTag.bgColor = "bg-tag-status";
      } else if (tag.category === "אטן") {
        displayTag.bgColor = "bg-tag-atn";
      } else if (tag.category === "ניהול") {
        displayTag.border = "border-2 border-tag-gizra";
      }

      displayTags.push(displayTag);
    }
    return displayTags;
  } catch (error) {
    console.error("Failed to fetch display tags:", error);
    return [];
  }
}

export async function createAccount(params: {
  displayName: string;
  email: string;
  passwordHash: string;
  createdBy: string;
  phone?: string | null;
}) {
  return prisma.account.create({
    data: {
      display_name: params.displayName,
      email: params.email,
      password_hash: params.passwordHash,
      created_by_id: params.createdBy,
      phone: params.phone ?? "",
    },
  });
}

export async function createAccountUserAndEmergency(params: {
  displayName: string;
  email: string;
  phone: string;
  passwordHash: string;
  createdBy: string;
  firstName: string;
  lastName: string;
  address: string;
  areaId: string;
  qualification: string;
  isActive: boolean;
  activeDate: Date | null;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  emergencyEmail: string;
  emergencyAddress: string;
}): Promise<{ accountId: string }> {
  const created = await prisma.$transaction(async (tx) => {
    const account = await tx.account.create({
      data: {
        display_name: params.displayName,
        email: params.email,
        phone: params.phone,
        password_hash: params.passwordHash,
        created_by_id: params.createdBy,
      } as Prisma.accountUncheckedCreateInput,
      select: { id: true },
    });

    const user = await tx.user_info.create({
      data: {
        account_id: account.id,
        first_name: params.firstName,
        last_name: params.lastName,
        image_url: null,
        address: params.address,
        area_id: params.areaId,
        role: params.qualification,
        active: params.isActive,
        active_date: params.activeDate,
        created_by_id: params.createdBy,
      } as Prisma.user_infoUncheckedCreateInput,
      select: { id: true },
    });

    await tx.emergency_contacts.create({
      data: {
        user_info_id: user.id,
        name: params.emergencyName,
        relationship: params.emergencyRelationship,
        phone: params.emergencyPhone,
        email: params.emergencyEmail,
        address: params.emergencyAddress,
        created_by_id: params.createdBy,
      } as Prisma.emergency_contactsUncheckedCreateInput,
    });

    return account;
  });

  return { accountId: created.id };
}

export async function updateAccountPassword(
  accountId: string,
  passwordHash: string,
) {
  return prisma.account.update({
    where: { id: accountId },
    data: { password_hash: passwordHash },
  });
}
