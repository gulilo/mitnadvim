import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTrigger } from "@/app/components/ui/alert-dialog";
import Image from "next/image";


function maskEmail(email: string) {
    return email.replace(/[a-zA-Z]/g, "*");
}

type EmailSentAlertProps = {
    email: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};
export default function EmailSentAlert({
    email,
    open,
    onOpenChange,
}: EmailSentAlertProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="w-full max-w-md flex flex-col items-center justify-center bg-[#FFFAA8] rounded-lg">
                <AlertDialogHeader>
                    <AlertDialogCancel className="absolute top-2 left-2 bg-[#FFFAA8] border-0 outline-none">
                        <Image src="/icon_close.svg" alt="close" width={20} height={20} />
                    </AlertDialogCancel>
                </AlertDialogHeader>
                <AlertDialogDescription className="text-center text-sm font-sans px-25 py-5 whitespace-pre-line">
                    {`ברגעים אלו נשלח קישור לאיפוס הסיסמא לכתובת 
            ${maskEmail(email)}
            המופיעה במערכת.`}

                </AlertDialogDescription>
            </AlertDialogContent>
        </AlertDialog>
    );
}
