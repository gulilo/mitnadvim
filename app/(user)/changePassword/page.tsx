import ChangePasswordForm from "./components/ChangePasswordForm";
import { validatePasswordResetToken } from "../data/passwordReset";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ChangePasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;
  const tokenData = await validatePasswordResetToken(token);

  return (
    <div className="flex flex-col items-center justify-center min-h-full w-full">
      <ChangePasswordForm
        mode={tokenData ? "reset" : "normal"}
        accountIdFromToken={tokenData?.accountId}
        firstName={tokenData?.firstName}
      />
    </div>
  );
}
