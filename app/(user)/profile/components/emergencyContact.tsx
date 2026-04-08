import type { emergency_contacts } from "@prisma/client";
import Image from "next/image";
import EditableField from "./editableField";

type EmergencyContactProps = {
  emergencyContact: emergency_contacts | null;
};

export default function EmergencyContact({
  emergencyContact,
}: EmergencyContactProps) {

  return (
    <div className="px-4 space-y-4 pb-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-row items-center justify-center gap-3">
          <Image src="/icon_sos.svg" alt="SOS" width={20} height={20} />
          <h5 className="text-base font-bold text-black">פרטי איש קשר בחרום</h5>
        </div>
      </div>

      {emergencyContact ? (
        <div className="flex flex-col gap-1 justify-center items-start">
          <EditableField
            id={emergencyContact.id}
            iconSrc="/icon_family.svg"
            fieldname="relationship"
            label="קרבה:"
            value={emergencyContact.relationship ?? ""}
            dir="rtl"
            table="emergency_contacts"
          />

          <EditableField
            id={emergencyContact.id}
            iconSrc="/icon_avatar.svg"
            fieldname="name"
            label="שם:"
            value={emergencyContact.name ?? ""}
            table="emergency_contacts"
          />

          <EditableField
            id={emergencyContact.id}
            iconSrc="/icon_phone.svg"
            fieldname="phone"
            label="מספר טלפון:"
            value={emergencyContact.phone ?? ""}
            dir="ltr"
            table="emergency_contacts"
          />

          <EditableField
            id={emergencyContact.id}
            iconSrc="/icon_email.svg"
            fieldname="email"
            label="כתובת דוא״ל:"
            value={emergencyContact.email ?? ""}
            dir="ltr"
            table="emergency_contacts"
            valueClassName="text-base font-normal text-black"
          />

          <EditableField
            id={emergencyContact.id}
            iconSrc="/icon_pin-home.svg"
            fieldname="address"
            label="כתובת:"
            value={emergencyContact.address ?? ""}
            dir="rtl"
            table="emergency_contacts"
            valueClassName="whitespace-pre-wrap"
          />
        </div>
      ) : (
        <p className="text-base text-gray-500 text-right">אין פרטי איש קשר בחרום</p>
      )}
    </div>
  );
}
