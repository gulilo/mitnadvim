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