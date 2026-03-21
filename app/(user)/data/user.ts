import { prisma } from "../../lib/data";
import { Account, Tag, User, DisplayTag } from "./definitions";

function toAccountModel(account: {
  id: string;
  display_name: string;
  email: string;
  phone: string | null;
  password_hash: string | null;
}): Account {
  return {
    id: account.id,
    display_name: account.display_name,
    email: account.email,
    phone: account.phone,
    password_hash: account.password_hash,
  };
}

function toUserModel(user: {
  id: string;
  account_id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  address: string | null;
  area_id: string | null;
  role: string | null;
  active: boolean;
  active_date: Date | null;
}): User {
  return {
    id: user.id,
    account_id: user.account_id,
    first_name: user.first_name,
    last_name: user.last_name,
    image_url: user.image_url,
    address: user.address,
    area_id: user.area_id,
    role: user.role,
    active: user.active,
    active_date: user.active_date,
  };
}

function toTag(tag: { id: string; name: string; category: string | null }): Tag {
  return {
    id: tag.id,
    name: tag.name,
    category: tag.category,
  };
}

export async function getUserByEmail(email: string): Promise<Account | undefined> {
  try {
    const user = await prisma.account.findUnique({ where: { email } });
    return user ? toAccountModel(user) : undefined;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function getUserByAccountId(accountId: string): Promise<User | undefined> {
  try {
    const user = await prisma.user_info.findFirst({ where: { account_id: accountId } });
    return user ? toUserModel(user) : undefined;
  } catch (error) {
    console.error("Failed to fetch user by account id:", error);
    throw new Error("Failed to fetch user by account id.");
  }
}

export async function getAccountByAccountId(accountId: string): Promise<Account | undefined> {
  try {
    const account = await prisma.account.findUnique({ where: { id: accountId } });
    return account ? toAccountModel(account) : undefined;
  } catch (error) {
    console.error("Failed to fetch account:", error);
    throw new Error("Failed to fetch account.");
  }
}

export async function getEmergencyContactByUserId(userId: string) {
  try {
    const contact = await prisma.emergency_contacts.findFirst({
      where: { user_id: userId },
    });
    return contact ?? null;
  } catch (error) {
    console.error("Failed to fetch emergency contact:", error);
    return null;
  }
}

export async function getAreaName(areaId: string): Promise<string | null> {
  try {
    const area = await prisma.area.findUnique({
      where: { id: areaId },
      select: { name: true },
    });
    return area?.name ?? null;
  } catch (error) {
    console.error("Failed to fetch area:", error);
    return null;
  }
}

export async function getUserTags(accountId: string): Promise<Tag[]> {
  try {
    const links = await prisma.account_tag.findMany({
      where: { account_id: accountId },
      select: {
        tag: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
    });
    return links.map((link) => toTag(link.tag));
  } catch (error) {
    console.error("Failed to fetch user tags:", error);
    return [];
  }
}

export async function getTagName(tagId: string): Promise<string | null> {
  try {
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
      select: { name: true },
    });
    return tag?.name ?? null;
  } catch (error) {
    console.error("Failed to fetch tag name:", error);
    return null;
  }
}

export async function getTagCategory(tagId: string): Promise<string | null> {
  try {
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
      select: { category: true },
    });
    return tag?.category ?? null;
  } catch (error) {
    console.error("Failed to fetch tag category:", error);
    return null;
  }
}

export async function getUserPermissions(tags: Tag[]): Promise<string[]> {
  try {
    if (!tags || tags.length === 0) {
      return [];
    }
    const permissions = await prisma.tag_permission.findMany({
      where: { tag_id: { in: tags.map((tag) => tag.id) } },
      select: {
        permission_id: true,
        permissions: { select: { name: true } },
      },
      distinct: ["permission_id"],
    });
    return permissions.map((permission) => permission.permissions.name);
  } catch (error) {
    console.error("Failed to fetch user permissions:", error);
    return [];
  }
}

export async function getUsersByPartialName(name: string): Promise<User[]> {
  try {
    const users = await prisma.user_info.findMany({
      where: {
        OR: [
          { first_name: { contains: name, mode: "insensitive" } },
          { last_name: { contains: name, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: {
        id: true,
        account_id: true,
        first_name: true,
        last_name: true,
        image_url: true,
        address: true,
        area_id: true,
        role: true,
        active: true,
        active_date: true,
      },
    });
    return users.map(toUserModel);
  } catch (error) {
    console.error("Failed to fetch users by partial name:", error);
    return [];
  }
}

export async function getAllTags() {
  try {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        category: true,
      },
    });
    return tags.map(toTag);
  } catch (error) {
    console.error("Failed to fetch all tags:", error);
    return [];
  }
}

export async function createAccountRecord(params: {
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
      created_by: params.createdBy,
      phone: params.phone ?? null,
    },
  });
}

export async function createAccountUserAndEmergencyRecords(params: {
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
        created_by: params.createdBy,
      },
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
        created_by: params.createdBy,
      },
      select: { id: true },
    });

    await tx.emergency_contacts.create({
      data: {
        user_id: user.id,
        name: params.emergencyName,
        relationship: params.emergencyRelationship,
        phone: params.emergencyPhone,
        email: params.emergencyEmail,
        address: params.emergencyAddress,
        created_by: params.createdBy,
      },
    });

    return account;
  });

  return { accountId: created.id };
}

export async function updateAccountPassword(accountId: string, passwordHash: string) {
  return prisma.account.update({
    where: { id: accountId },
    data: { password_hash: passwordHash },
  });
}

export async function getDisplayTags(tags: Tag[]): Promise<DisplayTag[]> {
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
    console.error('Failed to fetch display tags:', error);
    return [];
  }
}