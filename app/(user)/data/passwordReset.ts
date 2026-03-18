import { sql } from "@/app/lib/data";
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
    const rows = (await sql`
      SELECT id, account_id, token_hash, expires_at
      FROM password_reset_token
      WHERE token_hash = ${tokenHash}
        AND expires_at > NOW()
      LIMIT 1
    `) as PasswordResetTokenRecord[];

    const row = rows[0];
    if (!row) {
      return null;
    }

    const userRows = (await sql`
      SELECT first_name FROM user_info WHERE account_id = ${row.account_id} LIMIT 1
    `) as { first_name: string }[];

    const firstName = userRows[0]?.first_name ?? "";
    return { accountId: row.account_id, firstName };
  } catch (error) {
    console.error("Failed to validate password reset token:", error);
    return null;
  }
}
