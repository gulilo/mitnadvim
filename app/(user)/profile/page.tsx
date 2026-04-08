import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  getUserByAccountId,
  getAccountByAccountId,
  getEmergencyContactByUserId,
  getAreaName,
  getUserTags,
  getDisplayTags,
} from "../data/user";
import { Separator } from "@/app/components/ui/separator";
import ChangePasswordButton from "./components/changePasswordButton";
import ProfileInfo from "./components/profileInfo";
import ContactInfo from "./components/contactInfo";
import EmergencyContact from "./components/emergencyContact";

export default async function Profile() {
  const session = await auth();
  if (!session?.user) {
    console.log("unauthenticated");
    redirect("./login");
  }

  const user = await getUserByAccountId(session.user.id);
  if (!user) {
    console.log("user not found");
    redirect("./login");
  }

  const account = await getAccountByAccountId(session.user.id);
  if(!account) {
    console.log("account not found");
    redirect("./login");
  }
  const emergencyContact = await getEmergencyContactByUserId(user.id);
  const areaName = user.area_id ? await getAreaName(user.area_id) : null;
  const tags = await getUserTags(session.user.id);
  const displayTags = await getDisplayTags(tags);
  return (
    <div
      dir="rtl"
      className="bg-[#f5f5f5] min-h-screen w-full max-w-[430px] mx-auto relative"
    >
      {/* Header */}
      <div className="flex items-center justify-center px-4 pt-2 pb-4">
        <h1 className="text-black text-center">אזור אישי</h1>
      </div>

      {/* Profile Picture Section */}
    <ProfileInfo user={user} areaName={areaName || ""} displayTags={displayTags} />

      {/* Contact Information Section */}
      <ContactInfo
        accountId={account.id}
        userId={user.id}
        phone={account.phone}
        email={account.email}
        address={user.address}
      />

      {/* Divider */}
      <Separator className="bg-red-inActive w-100 mx-4 my-6" />

      {/* Emergency Contact Section */}
      <EmergencyContact emergencyContact={emergencyContact} />

      {/* Change Password Button */}
      <div className="px-4 pb-4">
          <ChangePasswordButton account={account} />
      </div>

      {/* Membership Status */}
      <div className="px-4 pb-8 text-center">
        <p className="text-base font-normal text-black">
          דמי חבר שולמו עד לתאריך: 31 בדצמבר, 2025
        </p>
      </div>
    </div>
  );
}
