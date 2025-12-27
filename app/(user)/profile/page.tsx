import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  getUserByAccountId,
  getAccountByAccountId,
  getEmergencyContactByUserId,
  getAreaName,
  getUserTags,
} from "../data/user";
import Image from "next/image";
import { Camera, User, Cross } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Tags from "../components/tags";
import HomeStation from "../components/homeStation";
import { Separator } from "@/app/components/ui/separator";

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
  const emergencyContact = await getEmergencyContactByUserId(user.id);
  const areaName = await getAreaName(user.area_id);
  const tags = await getUserTags(session.user.id);

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
      <div className="flex flex-row items-center px-4 pb-4">
        <div className="relative max-w-[141px] max-h-[141px] min-w-[141px] min-h-[141px] mb-3">
          {user.image_url ? (
            <Image
              src={user.image_url}
              alt={`${user.first_name} ${user.last_name}`}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
              <User className="w-full h-full text-gray-500" />
            </div>
          )}
          <button className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center border-2 border-gray-200 shadow-sm">
            <Camera className="w-4 h-4 text-black" />
          </button>
        </div>
        {/* Role and Name Section */}
        <div className="flex flex-col mr-3 justify-center gap-1 ">
          <h4 className="text-black pb-1 mb-1">{user.role}</h4>

          {/* Star of Life icon placeholder - using Cross as approximation */}
          <div className="flex flex-row mr-3">
            <Cross className="w-6 h-6 text-black" />
            <div className="flex flex-col mr-3">
              <h3 className=" text-black ">{user.first_name}</h3>
              <h3 className=" text-black">{user.last_name}</h3>
            </div>
          </div>

          {/* Home Station */}
         <HomeStation areaName={areaName || ""} />

          {/* Tags */}
          <Tags tagsids={tags} />
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="px-4 space-y-4">
        {/* Phone */}
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="flex flex-row items-center justify-center gap-3">
            <Image src="/icon_phone.svg" alt="Phone" width={20} height={20} />
            <h5 className="text-black  mb-1">מספר טלפון רשום:</h5>
          </div>
          <h5 dir="ltr" className="text-black">
            {account?.phone}
          </h5>
          <Image src="/icon_edit.svg" alt="Edit" width={20} height={20} />
        </div>

        {/* Email */}
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="flex flex-row items-center justify-center gap-3">
            <Image src="/icon_email.svg" alt="Email" width={20} height={20} />
            <h5 className=" text-black mb-1">כתובת דוא״ל:</h5>
          </div>
          <p dir="ltr" className="text-black">
            {account?.email}
          </p>
          <Image src="/icon_edit.svg" alt="Edit" width={20} height={20} />
        </div>

        {/* Address */}
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="flex flex-row items-center justify-center gap-3">
            <Image src="/icon_pin-home.svg" alt="Home" width={20} height={20} />
            <h5 className="text-black  mb-1">כתובת:</h5>
          </div>
          <p dir="ltr" className=" text-black whitespace-pre-wrap">
            {user.address}
          </p>
          <Image src="/icon_edit.svg" alt="Edit" width={20} height={20} />
        </div>
      </div>

      {/* Divider */}
      <Separator className="bg-red-inActive w-100 mx-4 my-6" />

      {/* Emergency Contact Section */}
      <div className="px-4 space-y-4 pb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-row items-center justify-center gap-3">
            <Image src="/icon_sos.svg" alt="SOS" width={20} height={20} />
            <h5 className="text-base font-bold text-black">
              פרטי איש קשר בחרום
            </h5>
          </div>
          <Image src="/icon_edit.svg" alt="Edit" width={20} height={20} />
        </div>

        {emergencyContact ? (
          <div className="flex flex-col gap-1 justify-center items-start w-90 mx-auto">
            {/* Relationship */}
            <div className="flex flex-row justify-between items-center gap-13">
              <div className="flex flex-row items-center gap-2">
                <Image
                  src="/icon_family.svg"
                  alt="Relationship"
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                />
                <h5 className=" block ">קרבה:</h5>
              </div>
              <p className=" ">{emergencyContact.relationship}</p>
            </div>

            {/* Name */}
            <div className="flex flex-row justify-between items-center gap-13">
              <div className="flex flex-row items-center gap-2">
                <Image
                  src="/icon_avatar.svg"
                  alt="Name"
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                />
                <h5 className=" block">שם:</h5>
              </div>
              <p className="">{emergencyContact.name}</p>
            </div>

            {/* Phone */}
            <div className="flex flex-row justify-between items-center gap-13">
              <div className="flex flex-row items-center gap-2">
                <Image
                  src="/icon_phone.svg"
                  alt="Phone"
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                />
                <h5 className="block ">מספר טלפון:</h5>
              </div>
              <p dir="ltr" className="">
                {emergencyContact.phone}
              </p>
            </div>

            {/* Email */}
            <div className="flex flex-row justify-between items-center gap-13">
              <div className="flex flex-row items-center gap-2">
                <Image
                  src="/icon_email.svg"
                  alt="Email"
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                />
                <h5 className=" block ">כתובת דוא״ל:</h5>
              </div>
              <p className="text-base font-normal text-black">
                {emergencyContact.email}
              </p>
            </div>

            {/* Address */}
            <div className="flex flex-row justify-between items-center gap-13">
              <div className="flex flex-row items-center gap-2">
                <Image
                  src="/icon_pin-home.svg"
                  alt="Address"
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                />
                <h5 className=" block">כתובת:</h5>
              </div>
              <p className=" whitespace-pre-wrap">{emergencyContact.address}</p>
            </div>
          </div>
        ) : (
          <p className="text-base text-gray-500 text-right">
            אין פרטי איש קשר בחרום
          </p>
        )}
      </div>

      {/* Change Password Button */}
      <div className="px-4 pb-4">
        <Button
          className="w-[240px] h-11 bg-red-500 hover:bg-red-600 text-white text-lg font-bold rounded-lg mx-auto block"
          variant="destructive"
        >
          שינוי סיסמא
        </Button>
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
