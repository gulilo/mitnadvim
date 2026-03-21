import { prisma } from "@/app/lib/data";
import { hashToken } from "../lib/actions";

export type PasswordResetTokenRecord = {
  id: string;
  account_id: string;
  token_hash: string;
  expires_at: Date;
};


/**
 * Validates the token from the set-password link and returns the account id and
 * first name if the token exists and is not expired.
 *
 * NOTE: The same hash function (SHA-256) must be used when storing the token
 * into the password_reset_token.token_hash column.
 */
export async function validatePasswordResetToken(
  token: string | null | undefined
): Promise<{ accountId: string; firstName: string } | null> {
  if (!token || typeof token !== "string" || token.trim() === "") {
    return null;
  }

  const tokenHash = await hashToken(token);

  try {
    const row = (await prisma.password_reset_token.findFirst({
      where: {
        token_hash: tokenHash,
        expires_at: { gt: new Date() },
      },
      select: {
        id: true,
        account_id: true,
        token_hash: true,
        expires_at: true,
      },
    })) as PasswordResetTokenRecord | null;
    if (!row) {
      return null;
    }

    const user = await prisma.user_info.findFirst({
      where: { account_id: row.account_id },
      select: { first_name: true },
    });
    const firstName = user?.first_name ?? "";
    return { accountId: row.account_id, firstName };
  } catch (error) {
    console.error("Failed to validate password reset token:", error);
    return null;
  }
}

export async function createPasswordResetTokenRecord(params: {
  accountId: string;
  tokenHash: string;
  expiresAt: Date;
  createdBy: string;
}) {
  return prisma.password_reset_token.create({
    data: {
      account_id: params.accountId,
      token_hash: params.tokenHash,
      expires_at: params.expiresAt,
      created_by: params.createdBy,
    },
  });
}
