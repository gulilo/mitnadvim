export type DbAccount = {
  id: string;
  display_name: string;
  email: string;
  phone: string | null;
  password_hash: string | null;
};

export type DbUser = {
  id: string;
  account_id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  address: string;
  area_id: string;
  role: string;
};

export type DbTag = {
  id: string;
  name: string;
  category: string;
};

export type DisplayTag ={
  id: string;
  name: string;
  bgColor: string;
  textColor: string;
  border: string;
}

export type DbEmergencyContact = {
  id: string;
  user_id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
}