import type { Prisma } from "@prisma/client";

export type Account = Prisma.accountGetPayload<{
  select: {
    id: true;
    display_name: true;
    email: true;
    phone: true;
    password_hash: true;
  };
}>;

export type User = Prisma.user_infoGetPayload<{
  select: {
    id: true;
    account_id: true;
    first_name: true;
    last_name: true;
    image_url: true;
    address: true;
    area_id: true;
    role: true;
    active: true;
    active_date: true;
  };
}>;

export type Tag = Prisma.tagGetPayload<{
  select: {
    id: true;
    name: true;
    category: true;
  };
}>;

export type DisplayTag ={
  id: string;
  name: string;
  bgColor: string;
  textColor: string;
  border: string;
}

export type EmergencyContact = Prisma.emergency_contactsGetPayload<{
  select: {
    id: true;
    user_info_id: true;
    name: true;
    relationship: true;
    phone: true;
    email: true;
    address: true;
  };
}>;
