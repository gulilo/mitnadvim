"use server";

import { auth } from "@/auth";
import { getAccountByAccountId, getAreaName, getUserByAccountId, getUserByEmail, getUserTags, getTagName, getTagCategory } from "../data/user";
import { DbAccount, DbTag, DbUser } from "../data/definitions";
import { sql } from "@/app/lib/data";
import bcrypt from "bcrypt";

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

export type CreateUserFormState = { error?: string };

function generateRandomPassword() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Validates all form fields and returns parsed values or an error.
 * No DB writes — run this before any insert.
 */
function validateCreateUserForm(formData: FormData): CreateUserFormState | {
  ok: true;
  email: string;
  phone: string;
  displayName: string;
  firstName: string;
  lastName: string;
  areaId: string;
  qualification: string;
  address: string;
  isActive: boolean;
  membershipYear: string | null;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  emergencyEmail: string;
  emergencyAddress: string;
  passwordHash: string;
} {
  const email = (formData.get("email") as string)?.trim();
  if (!email) {
    return { error: "נא להזין כתובת דוא״ל" };
  }

  const firstName = (formData.get("first_name") as string)?.trim() ?? "";
  const lastName = (formData.get("last_name") as string)?.trim() ?? "";
  if (!firstName || !lastName) {
    return { error: "נא להזין שם פרטי ושם משפחה" };
  }

  const areaId = (formData.get("home_station") as string)?.trim();
  if (!areaId) {
    return { error: "נא לבחור תחנת אם" };
  }

  const qualification = (formData.get("qualification") as string)?.trim();
  if (!qualification) {
    return { error: "נא לבחור הכשרה" };
  }

  const emergencyRelationship = (formData.get("emergency_relationship") as string)?.trim();
  if (!emergencyRelationship) {
    return { error: "נא לבחור קרבה לאיש קשר בחירום" };
  }

  const emergencyName = (formData.get("emergency_name") as string)?.trim() ?? "";
  const emergencyPhone = (formData.get("emergency_phone") as string)?.trim() ?? "";
  if (!emergencyName || !emergencyPhone) {
    return { error: "נא להזין שם ומספר טלפון לאיש קשר בחירום" };
  }

  const phone = (formData.get("phone") as string)?.trim() ?? "";
  const address = (formData.get("address") as string)?.trim() ?? "";
  const isActive = (formData.get("is_active") as string) === "true";
  const membershipYearRaw = (formData.get("membership_year") as string)?.trim() || null;
  const emergencyEmail = (formData.get("emergency_email") as string)?.trim() ?? "";
  const emergencyAddress = (formData.get("emergency_address") as string)?.trim() ?? "";
  const passwordHash = generateRandomPassword();
  const displayName = `${firstName} ${lastName}`.trim();

  return {
    ok: true,
    email,
    phone,
    displayName,
    firstName,
    lastName,
    areaId,
    qualification,
    address,
    isActive,
    membershipYear: membershipYearRaw,
    emergencyName,
    emergencyRelationship,
    emergencyPhone,
    emergencyEmail,
    emergencyAddress,
    passwordHash,
  };
}

/**
 * Single atomic insert: account → user_info → emergency_contacts.
 * All succeed or all roll back (single statement).
 */
async function createAccountUserAndEmergency(params: {
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
}): Promise<{ error?: string }> {
  try {
    await sql`
      WITH new_account AS (
        INSERT INTO account (display_name, email, phone, password_hash, created_by)
        VALUES (${params.displayName}, ${params.email}, ${params.phone}, ${params.passwordHash}, ${params.createdBy})
        RETURNING id
      ),
      new_user AS (
        INSERT INTO user_info (account_id, first_name, last_name, image_url, address, area_id, role, active, active_date, created_by)
        SELECT new_account.id, ${params.firstName}, ${params.lastName}, null, ${params.address}, ${params.areaId}, ${params.qualification}, ${params.isActive}, ${params.activeDate}, ${params.createdBy}
        FROM new_account
        RETURNING id
      )
      INSERT INTO emergency_contacts (user_id, name, relationship, phone, email, address, created_by)
      SELECT new_user.id, ${params.emergencyName}, ${params.emergencyRelationship}, ${params.emergencyPhone}, ${params.emergencyEmail}, ${params.emergencyAddress}, ${params.createdBy}
      FROM new_user
    `;
    return {};
  } catch (error) {
    console.error("Failed to create account, user and emergency contact:", error);
    return { error: "יצירת המשתמש נכשלה. נא לנסות שוב." };
  }
}

export async function submitCreateUserForm(
  _prevState: CreateUserFormState,
  formData: FormData
): Promise<CreateUserFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "יש להתחבר כדי ליצור משתמש" };
  }

  // 1. Validate all fields first (no DB writes)
  const validated = validateCreateUserForm(formData);
  if (!("ok" in validated) || !validated.ok) {
    return validated as CreateUserFormState;
  }

  const createdBy = session.user.id;

  // 2. Check email uniqueness (single read)
  const exists = await accountExistsByEmail(validated.email);
  if (exists) {
    return { error: "חשבון עם כתובת דוא״ל זו כבר קיים במערכת" };
  }

  // 3. Single atomic insert: account + user_info + emergency_contacts
  const activeDate = validated.membershipYear
    ? new Date(`${validated.membershipYear}-12-31`)
    : null;

  const result = await createAccountUserAndEmergency({
    displayName: validated.displayName,
    email: validated.email,
    phone: validated.phone,
    passwordHash: validated.passwordHash,
    createdBy,
    firstName: validated.firstName,
    lastName: validated.lastName,
    address: validated.address,
    areaId: validated.areaId,
    qualification: validated.qualification,
    isActive: validated.isActive,
    activeDate,
    emergencyName: validated.emergencyName,
    emergencyRelationship: validated.emergencyRelationship,
    emergencyPhone: validated.emergencyPhone,
    emergencyEmail: validated.emergencyEmail,
    emergencyAddress: validated.emergencyAddress,
  });

  return result;
}

export type ChangePasswordFormState = { error?: string; success?: boolean };

const PASSWORD_MIN_LENGTH = 11;

function validateNewPassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return "על הסיסמא להיות באורך של לפחות 11 תווים";
  }
  if (!/\d/.test(password)) return "על הסיסמא להכיל לפחות ספרה אחת";
  if (!/[A-Z]/.test(password)) return "על הסיסמא להכיל לפחות אות גדולה";
  if (!/[a-z]/.test(password)) return "על הסיסמא להכיל לפחות אות קטנה";
  if (!/[^A-Za-z0-9]/.test(password)) return "על הסיסמא להכיל לפחות סימן";
  return null;
}

export async function changePassword(
  _prevState: ChangePasswordFormState,
  formData: FormData
): Promise<ChangePasswordFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "יש להתחבר כדי לשנות סיסמא" };
  }

  const currentPassword = (formData.get("current_password") as string)?.trim();
  const newPassword = (formData.get("new_password") as string)?.trim();
  const confirmPassword = (formData.get("confirm_password") as string)?.trim();

  if (!currentPassword) {
    return { error: "נא להזין סיסמא נוכחית" };
  }
  if (!newPassword) {
    return { error: "נא להזין סיסמא חדשה" };
  }
  if (newPassword !== confirmPassword) {
    return { error: "אימות הסיסמא אינו תואם" };
  }

  const validationError = validateNewPassword(newPassword);
  if (validationError) {
    return { error: validationError };
  }

  const account = await getAccountByAccountId(session.user.id);
  if (!account?.password_hash) {
    return { error: "לא נמצא חשבון" };
  }

  const match = await bcrypt.compare(currentPassword, account.password_hash);
  if (!match) {
    return { error: "סיסמא נוכחית שגויה" };
  }

  const hash = await bcrypt.hash(newPassword, 12);
  try {
    await sql`
      UPDATE account
      SET password_hash = ${hash}
      WHERE id = ${session.user.id}
    `;
    return { success: true };
  } catch (error) {
    console.error("Failed to update password:", error);
    return { error: "שמירת הסיסמא נכשלה. נא לנסות שוב." };
  }
}