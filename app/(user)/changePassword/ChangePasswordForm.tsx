"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, LockKeyhole, AlertCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { changePassword, type ChangePasswordFormState } from "../lib/actions";

function PasswordField({
  id,
  name,
  label,
  showConfirmationIcon = false,
}: {
  id: string;
  name: string;
  label: string;
  showConfirmationIcon?: boolean;
}) {
  return (
    <div className="flex flex-row items-center justify-between gap-3 w-full">
      <div className="flex flex-row items-center gap-2 min-w-0 flex-1 justify-end">
        <span className="text-base font-bold text-black shrink-0">{label}</span>
        <span className="shrink-0 text-black">
          {showConfirmationIcon ? (
            <LockKeyhole className="size-6" aria-hidden />
          ) : (
            <Lock className="size-6" aria-hidden />
          )}
        </span>
      </div>
      <input
        id={id}
        name={name}
        type="password"
        required
        className="h-9 w-[171px] shrink-0 rounded-lg border border-[var(--red-active)] bg-white px-3 text-base text-black placeholder:text-muted-foreground outline-none"
        placeholder=""
        dir="ltr"
        autoComplete={name === "current_password" ? "current-password" : "new-password"}
      />
    </div>
  );
}

export default function ChangePasswordForm() {
  const [state, formAction] = useActionState<ChangePasswordFormState, FormData>(
    changePassword,
    {}
  );

  return (
    <div
      dir="rtl"
      className="flex flex-col min-h-full bg-[#f5f5f5] w-full max-w-[430px] mx-auto"
    >
      {/* Logo - top right */}
      <div className="flex justify-start pt-2 pr-2">
        <Link href="/" className="relative h-10 w-15 block">
          <Image
            src="/MDA-Dan-Logo.png"
            alt="מגן דוד אדום - מרחב דן"
            width={60}
            height={40}
            className="object-contain"
            priority
          />
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-center text-[18px] font-bold leading-[100%] text-black pt-1 pb-6">
        החלפת סיסמא
      </h1>

      <form action={formAction} className="flex flex-col flex-1 pt-4 pb-11 mx-auto">
        <div className="flex flex-col gap-5">
          <PasswordField
            id="current_password"
            name="current_password"
            label="סיסמא נוכחית:"
          />
          <PasswordField
            id="new_password"
            name="new_password"
            label="סיסמא חדשה:"
          />
          <PasswordField
            id="confirm_password"
            name="confirm_password"
            label="אימות סיסמא:"
            showConfirmationIcon
          />
        </div>

        {/* Requirements note */}
        <div className="flex flex-row items-start gap-2 mt-6 text-right">
          <AlertCircle
            className="size-6 shrink-0 text-[var(--red-active)] mt-0.5"
            aria-hidden
          />
          <p className="text-base font-normal text-black leading-[100%] flex-1 max-w-[222px]">
            <span className="font-bold">לתשומת ליבך</span>
            {`, על הסיסמא להיות באורך של `}
            <span className="font-bold">לפחות</span>
            {` 11 תווים, ולהכיל לפחות סיפרה אחת, אות גדולה, אות קטנה וסימן.`}
          </p>
        </div>

        {/* Error / success message */}
        {state?.error && (
          <p className="mt-4 text-base text-[var(--red-active)] text-center">
            {state.error}
          </p>
        )}
        {state?.success && (
          <p className="mt-4 text-base text-green-600 text-center font-medium">
            הסיסמא עודכנה בהצלחה.
          </p>
        )}

        {/* Buttons - fixed at bottom on mobile, double button row */}
        <div className="mt-auto pt-8 flex flex-row justify-center gap-0 w-full max-w-[357px] mx-auto">
          <Button
            type="submit"
            className="flex-1 h-11 rounded-r-lg rounded-l-none bg-[var(--red-inActive)] hover:bg-[var(--red-active)] text-white text-[18px] font-bold border border-[var(--red-active)]"
          >
            שמירה
          </Button>
          <Button
            type="button"
            asChild
            variant="outline"
            className="flex-1 h-11 rounded-l-lg rounded-r-none bg-white text-black text-[18px] font-bold border border-[var(--red-active)] hover:bg-gray-50"
          >
            <Link href="/profile">ביטול</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
