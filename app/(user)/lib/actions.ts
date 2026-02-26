"use server";

import { auth } from "@/auth";
import { getAccountByAccountId, getAreaName, getUserByAccountId, getUserByEmail, getUserTags, getTagName, getTagCategory } from "../data/user";
import { DbEmergencyContact, DbTag, DbUser } from "../data/definitions";
import { DbAccount } from "../data/definitions";
import { sql } from "@/app/lib/data";

export type ProfileData = {
  user: DbUser;
  account: DbAccount;
  areaName: string;
  tags: DbTag[];
}

export async function getProfileData() {
  try {
    const session = await auth();
    if (!session?.user) {
      return null;
    }

    const user = await getUserByAccountId(session.user.id);
    if (!user) {
      return null;
    }

    const account = await getAccountByAccountId(session.user.id);
    const areaName = await getAreaName(user.area_id);
    const tags = await getUserTags(session.user.id);

    return {
      user,
      account,
      areaName,
      tags,
    } as ProfileData;
  } catch (error) {
    console.error('Failed to fetch profile data:', error);
    return null;
  }
}

export async function getTagsData(tagIds: string[]) {
  try {
    const tagCategories = await Promise.all(
      tagIds.map(async (tagId) => {
        return await getTagCategory(tagId);
      })
    );

    const tagNames = await Promise.all(
      tagIds.map(async (tagId) => {
        return await getTagName(tagId);
      })
    );

    const tags = tagNames.map((tagName, index) => {
      return {
        name: tagName,
        category: tagCategories[index],
      };
    });

    return tags;
  } catch (error) {
    console.error('Failed to fetch tags data:', error);
    return [];
  }
}

export async function accountExistsByEmail(email: string): Promise<boolean> {
  try {
    const account = await getUserByEmail(email);
    return !!account;
  } catch {
    return false;
  }
}

export async function createAccount(account: DbAccount): Promise<string | null> {
  try {
    const accountId = await sql`INSERT INTO account
     (display_name, email, phone, password_hash) VALUES 
     (${account.display_name}, ${account.email}, ${account.phone}, ${account.password_hash})
     RETURNING id`;

    return accountId[0].id;
  } catch (error) {
    console.error('Failed to create account:', error);
    return null;
  }
}

export async function createUser(user: DbUser): Promise<string | null> {
  try {
    const newUser = await sql`INSERT INTO user_info
     (account_id, first_name, last_name, image_url, address, area_id, role) VALUES 
     (${user.account_id}, ${user.first_name}, ${user.last_name}, ${user.image_url}, ${user.address}, ${user.area_id}, ${user.role})
     RETURNING id`;
    return newUser[0].id as string;
  } catch (error) {
    console.error('Failed to create user:', error);
    return null;
  }
}

export async function createEmergencyContact(emergencyContact: DbEmergencyContact): Promise<string | null> {
  try {
    const newEmergencyContact = await sql`INSERT INTO emergency_contacts
     (user_id, name, relationship, phone, email, address) VALUES 
     (${emergencyContact.user_id}, ${emergencyContact.name}, ${emergencyContact.relationship}, ${emergencyContact.phone}, ${emergencyContact.email}, ${emergencyContact.address})
     RETURNING id`;
    return newEmergencyContact[0].id as string;
  } catch (error) {
    console.error('Failed to create emergency contact:', error);
    return null;
  }
}

export type CreateUserFormState = { error?: string };

function generateRandomPassword() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function submitCreateUserForm(
  _prevState: CreateUserFormState,
  formData: FormData
): Promise<CreateUserFormState> {
  const email = (formData.get("email") as string)?.trim();
  if (!email) {
    return { error: "נא להזין כתובת דוא״ל" };
  }

  const exists = await accountExistsByEmail(email);
  if (exists) {
    return { error: "חשבון עם כתובת דוא״ל זו כבר קיים במערכת" };
  }

  const password = generateRandomPassword();
  const account: DbAccount = {
    id: "",
    email,
    phone: (formData.get("phone") as string) ?? "",
    password_hash: password,
    display_name: `${formData.get("first_name") as string} ${formData.get("last_name") as string}`,
  };

  const accountId = await createAccount(account);
  if (!accountId) {
    return { error: "יצירת החשבון נכשלה" };
  }

  const user: DbUser = {
    id: "",
    account_id: accountId,
    first_name: (formData.get("first_name") as string) ?? "",
    last_name: (formData.get("last_name") as string) ?? "",
    role: (formData.get("qualification") as string) ?? "",
    address: (formData.get("address") as string) ?? "",
    image_url: null,
    area_id: (formData.get("home_station") as string) ?? "",
  };

  const newUser = await createUser(user);
  if (!newUser) {
    return { error: "יצירת המשתמש נכשלה" };
  }

  const emergencyContact: DbEmergencyContact = {
    id: "",
    user_id: newUser,
    name: (formData.get("emergency_name") as string) ?? "",
    relationship: (formData.get("emergency_relationship") as string) ?? "",
    phone: (formData.get("emergency_phone") as string) ?? "",
    email: (formData.get("emergency_email") as string) ?? "",
    address: (formData.get("emergency_address") as string) ?? "",
  };
  const newEmergencyContact = await createEmergencyContact(emergencyContact);
  if (!newEmergencyContact) {
    return { error: "יצירת איש קשר לחירום נכשלה" };
  }

  return {};
}