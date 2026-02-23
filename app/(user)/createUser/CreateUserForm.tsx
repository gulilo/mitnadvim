"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { cn } from "@/app/lib/utils";
import type { DbArea } from "@/app/(schedule)/data/launchPoint";
import { Camera } from "lucide-react";
import { Switch } from "@/app/components/ui/switch";

const QUALIFICATION_OPTIONS = [
  { value: "first_aid_m", label: "מגיש עזרה ראשונה" },
  { value: "first_aid_f", label: "מגישת עזרה ראשונה" },
  { value: "emc_m", label: "חובש רפואת חירום" },
  { value: "emc_f", label: "חובשת רפואת חירום" },
  { value: "paramedic_m", label: "פאראמדיק" },
  { value: "paramedic_f", label: "פאראמדיקית" },
  { value: "driver_corpsman_m", label: "נהג-חובש" },
  { value: "driver_corpsman_f", label: "נהגת-חובשת" },
  { value: "corpsman_driver_trainee_m", label: "חובש - נהג משתלם" },
  { value: "corpsman_driver_trainee_f", label: "חובשת - נהגת משתלמת" },
];

const RELATIONSHIP_OPTIONS = [
  { value: "spouse", label: "בן/בת זוג" },
  { value: "parent", label: "הורה" },
  { value: "sibling", label: "אח/ות" },
  { value: "child", label: "ילד/ה" },
  { value: "other", label: "אחר" },
];

const MEMBERSHIP_YEARS = ["2025", "2026", "2027", "2028", "2029"];

function ActiveToggle({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "h-[31px] w-[51px] shrink-0 rounded-full transition-colors",
        checked ? "bg-red-active" : "bg-[rgba(120,120,128,0.16)]"
      )}
    >
      <span
        className={cn(
          "block h-[27px] w-[27px] rounded-full bg-white shadow-sm transition-transform",
          "mt-0.5 ml-0.5",
          checked && "translate-x-5"
        )}
      />
    </button>
  );
}

function FormRow({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row items-center justify-between gap-3 py-2">
      <div className="flex flex-row items-center gap-2 min-w-0">
        <Image src={icon} alt="" width={24} height={24} className="shrink-0" />
        <h5 className="text-base font-bold text-black">{label}</h5>
      </div>
      <div className="min-w-0 flex-1 flex justify-end">{children}</div>
    </div>
  );
}

export default function CreateUserForm({ areas }: { areas: DbArea[] }) {
  const [qualification, setQualification] = useState("");
  const [homeStation, setHomeStation] = useState("");
  const [membershipYear, setMembershipYear] = useState("2025");
  const [isActive, setIsActive] = useState(false);
  const [emergencyRelationship, setEmergencyRelationship] = useState("");

  return (
    <form className="flex flex-col w-full max-w-[430px] mx-auto px-4 pb-8" >
      {/* User Info */}
      <div className="flex flex-row gap-4 pb-4">
        <div className="flex flex-col items-center shrink-0">
          <div className="relative w-[141px] h-[141px] border border-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            <div className="w-full h-full" />
            <button
              type="button"
              className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center border-2 border-gray-200 shadow-sm"
            >
              <Camera className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex flex-row items-center gap-2">

          </div>
          <Select value={qualification} onValueChange={setQualification}>
            <SelectTrigger className="w-full border-b-2 border-b-primary bg-transparent rounded-none h-auto py-1">
              <SelectValue placeholder="הכשרה" />
            </SelectTrigger>
            <SelectContent>
              {QUALIFICATION_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="text"
            name="first_name"
            placeholder="שם פרטי"
            className="border-b-2 border-b-primary bg-transparent w-full py-1 text-lg font-bold focus:outline-none"
            dir="rtl"
          />
          <input
            type="text"
            name="last_name"
            placeholder="שם משפחה"
            className="border-b-2 border-b-primary bg-transparent w-full py-1 text-lg font-bold focus:outline-none"
            dir="rtl"
          />
          <div className="flex flex-row items-center gap-2 mt-2">

            <Image src="/icon_pin-MDA.svg" alt="" width={10} height={15} />
            <h4 className="text-sm font-medium text-black">תחנת אם:</h4>

            <Select value={homeStation} onValueChange={setHomeStation}>
              <SelectTrigger>
                <SelectValue placeholder="בחר תחנה" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* בחירת קבוצות */}
        </div>

      </div>

      <Separator className="bg-red-inActive my-2" />

      {/* Membership */}
      <div className="py-4 space-y-3">
        <div className="flex flex-row items-center gap-3">
          <Switch
            dir="rtl"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
          <h5 className="text-base font-bold text-black">
            {isActive ? "משתמש פעיל" : "משתמש לא פעיל"}
          </h5>

        </div>
        <div className="flex flex-row items-center gap-2">

          
          <p className="text-base font-normal text-black">
            דמי חבר שולמו עד לתאריך: 31 בדצמבר,
          </p>
          <Select
            value={membershipYear}
            onValueChange={setMembershipYear}
          >
            <SelectTrigger className=" rounded-none h-auto py-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEMBERSHIP_YEARS.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="bg-red-inActive my-2" />

      {/* Contact Info */}
      <div className="py-4 space-y-0">
        <FormRow icon="/icon_phone.svg" label="מספר טלפון רשום:">
          <input
            type="tel"
            name="phone"
            dir="ltr"
            className="border-b-2 border-b-primary bg-transparent flex-1 min-w-0 py-1 text-base focus:outline-none text-right"
          />
        </FormRow>
        <FormRow icon="/icon_email.svg" label="כתובת דוא״ל:">
          <input
            type="email"
            name="email"
            dir="ltr"
            className="border-b-2 border-b-primary bg-transparent flex-1 min-w-0 py-1 text-base focus:outline-none text-right"
          />
        </FormRow>
        <FormRow icon="/icon_pin-home.svg" label="כתובת:">
          <input
            type="text"
            name="address"
            className="border-b-2 border-b-primary bg-transparent flex-1 min-w-0 py-1 text-base focus:outline-none text-right"
            dir="rtl"
          />
        </FormRow>
      </div>

      <Separator className="bg-red-inActive my-2" />

      {/* Emergency Contact */}
      <div className="py-4 space-y-0">
        <div className="flex flex-row items-center gap-2 pb-3">
          <Image src="/icon_sos.svg" alt="" width={24} height={24} />
          <h5 className="text-base font-bold text-black">
            פרטי איש קשר בחרום
          </h5>
        </div>
        <FormRow icon="/icon_family.svg" label="קרבה:">
          <Select
            value={emergencyRelationship}
            onValueChange={setEmergencyRelationship}
          >
            <SelectTrigger className="w-full max-w-[180px] border-b-2 border-b-primary bg-transparent rounded-none h-auto py-1">
              <SelectValue placeholder="בחר" />
            </SelectTrigger>
            <SelectContent>
              {RELATIONSHIP_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormRow>
        <FormRow icon="/icon_avatar.svg" label="שם:">
          <input
            type="text"
            name="emergency_name"
            className="border-b-2 border-b-primary bg-transparent flex-1 min-w-0 py-1 text-base focus:outline-none text-right"
            dir="rtl"
          />
        </FormRow>
        <FormRow icon="/icon_phone.svg" label="מספר טלפון:">
          <input
            type="tel"
            name="emergency_phone"
            dir="ltr"
            className="border-b-2 border-b-primary bg-transparent flex-1 min-w-0 py-1 text-base focus:outline-none text-right"
          />
        </FormRow>
        <FormRow icon="/icon_email.svg" label="כתובת דוא״ל:">
          <input
            type="email"
            name="emergency_email"
            dir="ltr"
            className="border-b-2 border-b-primary bg-transparent flex-1 min-w-0 py-1 text-base focus:outline-none text-right"
          />
        </FormRow>
        <FormRow icon="/icon_pin-home.svg" label="כתובת:">
          <input
            type="text"
            name="emergency_address"
            className="border-b-2 border-b-primary bg-transparent flex-1 min-w-0 py-1 text-base focus:outline-none text-right"
            dir="rtl"
          />
        </FormRow>
      </div>

      <div className="pt-6 flex justify-center">
        <Button
          type="submit"
          className="w-[260px] h-11 bg-red-active hover:bg-red-500 text-white text-lg font-bold rounded-lg"
          variant="destructive"
        >
          יצירת משתמש
        </Button>
      </div>
    </form>
  );
}
