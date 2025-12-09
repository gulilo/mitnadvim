import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import Image from "next/image";

export default function ForgotPasswordPanel() {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="text-white text-sm font-sans underline mt-2">
        שכחתי סיסמא
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-md flex flex-col items-center justify-center bg-[#FFFAA8] rounded-lg">
        <AlertDialogHeader>
          <AlertDialogCancel className="absolute top-2 left-2 bg-[#FFFAA8] border-0 outline-none">
            <Image src="/icon_close.svg" alt="close" width={20} height={20} />
          </AlertDialogCancel>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <div className="w-full border-b-2 border-black">
            <input
              id="phone"
              className="w-full bg-transparent text-black placeholder-white/70 py-2 px-0 border-0 outline-none text-center"
              type="tel"
              placeholder=""
              name="email"
              required
            />
          </div>
          <label
            htmlFor="phone"
            className="text-black text-sm font-sans text-center"
          >
            מספר טלפון רשום במערכת
          </label>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction className="w-full bg-[#FF6969] text-white font-bold rounded-lg py-3 px-6 border-2 border-[#FF5555] hover:bg-[#FF5555] transition-colors">
            שחזור סיסמא
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
