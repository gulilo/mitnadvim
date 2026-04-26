import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
} from "../../../components/ui/alert-dialog";
import Image from "next/image";

type InvalidCredentialsProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function InvalidCredentials({ open, onOpenChange }: InvalidCredentialsProps) {
    const handleClose = () => {
        onOpenChange(false);
    };
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogCancel className="absolute top-2 left-2 bg-[#FFFAA8] border-0 outline-none">
                        <Image src="/icon_close.svg" alt="close" width={20} height={20} />
                    </AlertDialogCancel>
                </AlertDialogHeader>
                <AlertDialogDescription className="flex flex-col items-center gap-2">
                    <Image src="/icon_alert.svg" alt="error" width={48} height={48} />
                    <p>מספר טלפון או סיסמא שגויים</p>
                </AlertDialogDescription>
                <AlertDialogAction
                    className="w-full bg-[#FF6969] text-white font-bold rounded-lg py-3 px-6 border-2 border-[#FF5555] hover:bg-[#FF5555] transition-colors"
                    onClick={handleClose}
                >
                    ניסיון חוזר
                </AlertDialogAction>
            </AlertDialogContent>
        </AlertDialog>
    )
}