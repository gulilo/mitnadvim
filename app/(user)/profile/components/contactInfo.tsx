import EditableField from "./editableField";

type ContactInfoProps = {
  accountId: string;
  userId: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
};

export default function ContactInfo({
  accountId,
  userId,
  phone,
  email,
  address,
}: ContactInfoProps) {

  return (
    <div className="px-4 space-y-4">
      <EditableField
        id={accountId}
        iconSrc="/icon_phone.svg"
        fieldname="phone"
        label="מספר טלפון רשום:"
        value={phone ?? ""}
        dir="ltr"
        table="account"
        valueClassName="text-black"
      />

      <EditableField
        id={accountId}
        iconSrc="/icon_email.svg"
        fieldname="email"
        label="כתובת דוא״ל:"
        value={email ?? ""}
        dir="ltr"
        table="account"
        valueClassName="text-black"
      />

      <EditableField  
        id={userId}
        iconSrc="/icon_pin-home.svg"
        fieldname="address"
        label="כתובת:"
        value={address ?? ""}
        dir="rtl"
        table="user_info"
        valueClassName="text-black whitespace-pre-wrap"
      />
    </div>
  );
}
