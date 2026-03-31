"use client";

import { Button } from "@/app/components/ui/button";
import { resetPassword } from "../../lib/actions";
import { account } from "@prisma/client";
import EmailSentAlert from "../../components/emailSentAlert";
import { useState } from "react";

export default function ChangePasswordButton({ account }: { account: account }) {
    const [isEmailSentAlertOpen, setIsEmailSentAlertOpen] = useState(false);

    async function handleResetPassword() {
        const response = await resetPassword(account);
        if (response.success) {
            setIsEmailSentAlertOpen(true);
        }
    }

    return (
        <>
            <Button
                className="w-[240px] h-11 bg-red-500 hover:bg-red-600 text-white text-lg font-bold rounded-lg mx-auto block"
                variant="destructive"
                onClick={handleResetPassword}
            >
                שינוי סיסמא
            </Button>
            <EmailSentAlert
                email={account.email}
                open={isEmailSentAlertOpen}
                onOpenChange={setIsEmailSentAlertOpen}
            />
        </>
    );
}   