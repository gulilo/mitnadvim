"use client";

import { EyeOff, Lock, LockKeyhole } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useActionState } from "react";
import { changePassword, ChangePasswordFormState } from "../../lib/actions";
import { redirect } from "next/navigation";

async function changePasswordAction(prevState: ChangePasswordFormState, formData: FormData): Promise<ChangePasswordFormState> {
  const result = await changePassword(prevState, formData);
  if (result.success) {
    redirect("/");
  }
  return result;
}

export default function SetPasswordForm({ accountId }: { accountId: string }) {
  const [state, formAction] = useActionState(changePasswordAction,{});
  return (
    <form action={formAction} className="flex flex-col flex-1 pt-8 pb-11 px-8 gap-6">
      <input type="hidden" name="account_id" value={accountId} />
      {/* New password */}
      <div className="flex flex-row items-center justify-between gap-3 w-full">
        <div className="flex flex-row items-center gap-2 min-w-0 flex-1 justify-end">
          <span className="text-base font-bold text-black shrink-0">
            סיסמא חדשה:
          </span>
          <span className="shrink-0 text-black">
            <Lock className="size-6" aria-hidden />
          </span>
        </div>
        <div className="relative w-[171px] shrink-0">
          <input
            id="new_password"
            name="new_password"
            type="password"
            required
            className="h-9 w-full rounded-lg border border-[var(--red-active)] bg-white px-3 text-base text-black placeholder:text-muted-foreground outline-none"
            dir="ltr"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute inset-y-0 left-2 flex items-center text-gray-500"
            aria-label="הצגת הסיסמא"
          >
            <EyeOff className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      {/* Confirm password */}
      <div className="flex flex-row items-center justify-between gap-3 w-full">
        <div className="flex flex-row items-center gap-2 min-w-0 flex-1 justify-end">
          <span className="text-base font-bold text-black shrink-0">
            אימות סיסמא:
          </span>
          <span className="shrink-0 text-black">
            <LockKeyhole className="size-6" aria-hidden />
          </span>
        </div>
        <div className="relative w-[171px] shrink-0">
          <input
            id="confirm_password"
            name="confirm_password"
            type="password"
            required
            className="h-9 w-full rounded-lg border border-[var(--red-active)] bg-white px-3 text-base text-black placeholder:text-muted-foreground outline-none"
            dir="ltr"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute inset-y-0 left-2 flex items-center text-gray-500"
            aria-label="הצגת אימות הסיסמא"
          >
            <EyeOff className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      {/* Submit button */}
      <div className="mt-auto pt-10 flex justify-center">
        <Button
          type="submit"
          className="w-full max-w-[356px] h-11 rounded-lg bg-[var(--red-inActive)] hover:bg-[var(--red-active)] text-white text-[18px] font-bold border border-[var(--red-active)]"
        >
          שמירת סיסמא
        </Button>
      </div>
    </form>
  );
}
