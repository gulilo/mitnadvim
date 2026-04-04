import Image from "next/image";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { validatePasswordResetToken } from "../data/passwordReset";
import SetPasswordForm from "@/app/(user)/setPassword/components/SetPasswordForm";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function SetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;
  const tokenData = await validatePasswordResetToken(token);
  if (!tokenData) {
    return (
      <div
        dir="rtl"
        className="flex flex-col min-h-full bg-[#f5f5f5] w-full max-w-[430px] mx-auto px-6 py-10"
      >
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
        <div className="flex flex-col items-center text-center gap-4 mt-8">
          <h1 className="text-xl font-bold text-black">קישור לא תקף או שפג תוקפו</h1>
          <p className="text-base text-black">
            קישור איפוס הסיסמא לא תקף, פג תוקפו או שכבר נוצל. אנא פנה למנהל המערכת לקבלת קישור חדש.
          </p>
          <Button asChild className="mt-4 bg-[var(--red-inActive)] hover:bg-[var(--red-active)] text-white">
            <Link href="/">חזרה לדף הבית</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { accountId, firstName } = tokenData;

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

      {/* Title & intro */}
      <div className="flex flex-col items-center text-center px-4 pt-4 gap-4">
        <h1 className="text-[34px] leading-[40px] font-bold text-black">
          ברוכים הבאים {firstName}!
        </h1>
        <p className="text-base leading-[100%] text-black max-w-[326px] text-right">
          ברוכים הבאים למערכת השיבוצים של מרחב דן.
          <br />
          זוהי הכניסה הראשונה שלך למערכת. כדי להמשיך יש ליצור סיסמא לחשבון.
        </p>
      </div>

      {/* Password requirements */}
      <div className="flex flex-row items-start gap-2 mt-10 px-8 text-right">
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

      <SetPasswordForm accountId={accountId} />
    </div>
  );
}