"use server";

import { auth } from "@/auth";
import {
  createAccountUserAndEmergency,
  getAccountByAccountId,
  getAreaName,
  getUserByAccountId,
  getUserByEmail,
  getUserTags,
  getTagName,
  getTagCategory,
  updateAccountPassword,
  getUserByPhone,
  updateAccountFields,
  updateEmergencyContactFields,
  updateUserInfoFields,
} from "../data/user";
import { createPasswordResetTokenRecord } from "../data/passwordReset";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { account, tag, user_info } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type ProfileData = {
  user: user_info;
  account: account;
  areaName: string;
  tags: tag[];
};

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
    if (!account) {
      return null;
    }

    const areaName = user.area_id ? await getAreaName(user.area_id) : null;
    const tags = await getUserTags(session.user.id);

    return {
      user,
      account,
      areaName: areaName ?? "",
      tags,
    };
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    return null;
  }
}

export async function getTagsData(tagIds: string[]) {
  try {
    const tagCategories = await Promise.all(
      tagIds.map(async (tagId) => {
        return await getTagCategory(tagId);
      }),
    );

    const tagNames = await Promise.all(
      tagIds.map(async (tagId) => {
        return await getTagName(tagId);
      }),
    );

    const tags = tagNames.map((tagName, index) => {
      return {
        name: tagName,
        category: tagCategories[index],
      };
    });

    return tags;
  } catch (error) {
    console.error("Failed to fetch tags data:", error);
    return [];
  }
}

export type CreateUserFormState = { error?: string };

function generateRandomPassword() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

/**
 * Validates all form fields and returns parsed values or an error.
 * No DB writes — run this before any insert.
 */
function validateCreateUserForm(formData: FormData):
  | CreateUserFormState
  | {
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

  const emergencyRelationship = (
    formData.get("emergency_relationship") as string
  )?.trim();
  if (!emergencyRelationship) {
    return { error: "נא לבחור קרבה לאיש קשר בחירום" };
  }

  const emergencyName =
    (formData.get("emergency_name") as string)?.trim() ?? "";
  const emergencyPhone =
    (formData.get("emergency_phone") as string)?.trim() ?? "";
  if (!emergencyName || !emergencyPhone) {
    return { error: "נא להזין שם ומספר טלפון לאיש קשר בחירום" };
  }

  const phone = (formData.get("phone") as string)?.trim() ?? "";
  const address = (formData.get("address") as string)?.trim() ?? "";
  const isActive = (formData.get("is_active") as string) === "true";
  const membershipYearRaw =
    (formData.get("membership_year") as string)?.trim() || null;
  const emergencyEmail =
    (formData.get("emergency_email") as string)?.trim() ?? "";
  const emergencyAddress =
    (formData.get("emergency_address") as string)?.trim() ?? "";
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
async function createAccountUserAndEmergencyRecord(params: {
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
}): Promise<{ error?: string; accountId?: string }> {
  try {
    const created = await createAccountUserAndEmergency(params);
    return { accountId: created.accountId };
  } catch (error) {
    console.error(
      "Failed to create account, user and emergency contact:",
      error,
    );
    return { error: "יצירת המשתמש נכשלה. נא לנסות שוב." };
  }
}

export async function submitCreateUserForm(
  _prevState: CreateUserFormState,
  formData: FormData,
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
  const exists = await getUserByEmail(validated.email);
  if (exists) {
    return { error: "חשבון עם כתובת דוא״ל זו כבר קיים במערכת" };
  }

  // 3. Single atomic insert: account + user_info + emergency_contacts
  const activeDate = validated.membershipYear
    ? new Date(`${validated.membershipYear}-12-31`)
    : null;

  const result = await createAccountUserAndEmergencyRecord({
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

  if (result.error) {
    return { error: result.error };
  }

  const token = await generateToken();
  const hashedToken = await hashToken(token);
  const accountId = result.accountId;
  await createPasswordResetTokenRecord({
    accountId: accountId!,
    tokenHash: hashedToken,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    createdBy,
  });

  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emailWelcome`, {
    method: "POST",
    body: JSON.stringify({
      email: validated.email,
      fullName: validated.displayName,
      token,
    }),
  });

  return result;
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
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
  formData: FormData,
): Promise<ChangePasswordFormState> {
  const formaccountId = (formData.get("account_id") as string)?.trim() || "";

  const currentPassword =
    (formData.get("current_password") as string | null)?.trim() || "";
  const newPassword = (formData.get("new_password") as string)?.trim();
  const confirmPassword = (formData.get("confirm_password") as string)?.trim();

  // Common validations
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

  // If we have an account id from a reset token, skip current password + session.
  const targetAccountId =
    formaccountId ||
    (await (async () => {
      const session = await auth();
      if (!session?.user?.id) {
        return "";
      }
      return session.user.id;
    })());

  if (!targetAccountId) {
    return { error: "יש להתחבר כדי לשנות סיסמא" };
  }

  const account = await getAccountByAccountId(targetAccountId);
  if (!account?.password_hash) {
    return { error: "לא נמצא חשבון" };
  }
  // Only require current password when not using a reset token
  if (formaccountId !== "") {
    if (currentPassword) {
      const match = await bcrypt.compare(
        currentPassword,
        account.password_hash,
      );
      if (!match) {
        return { error: "סיסמא נוכחית שגויה" };
      }
    }
  }

  const hash = await bcrypt.hash(newPassword, 12);
  try {
    await updateAccountPassword(targetAccountId, hash);
    return { success: true };
  } catch (error) {
    console.error("Failed to update password:", error);
    return { error: "שמירת הסיסמא נכשלה. נא לנסות שוב." };
  }
}

export async function forgotPassword(phone: string) {
  const account = await getUserByPhone(phone);
  if (!account) {
    return { error: "לא נמצא חשבון" };
  }
  const token = await generateToken();
  const hashedToken = await hashToken(token);

  await createPasswordResetTokenRecord({
    accountId: account.id,
    tokenHash: hashedToken,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    createdBy: account.id,
  });
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/forgotPassword`, {
    method: "POST",
    body: JSON.stringify({
      email: account.email,
      fullName: account.display_name,
      token,
    }),
  });
  return { success: true };
}

export async function resetPassword(account: account) {
  const token = await generateToken();
  const hashedToken = await hashToken(token);

  await createPasswordResetTokenRecord({
    accountId: account.id,
    tokenHash: hashedToken,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    createdBy: account.id,
  });
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/forgotPassword`, {
    method: "POST",
    body: JSON.stringify({
      email: account.email,
      fullName: account.display_name,
      token,
    }),
  });
  return { success: true };
}

export async function updateProfileField(params: {
  table:string
  id: string;
  field: string;
  value: string;
}) {
  try {
    const value = params.value.trim();

    if(params.table === "user_info") {
      await updateUserInfoFields(params.id, { [params.field]: value });
    }
    else if(params.table === "account") {
      await updateAccountFields(params.id, { [params.field]: value });
    }
    else if(params.table === "emergency_contacts") {
      await updateEmergencyContactFields(params.id, { [params.field]: value });
    }
    
    revalidatePath("/profile");
    return { success: true as const };
  } catch (error) {
    console.error("Failed to update profile field:", error);
    return { success: false as const, error: "עדכון הפרטים נכשל. נא לנסות שוב." };
  }
}