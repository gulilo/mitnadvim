export type DbAccount = { id: string; email: string; password_hash: string; name: string; user_group_id: string };

export type DbUser = { id: string; firstName: string; lastName: string; image: string; address: string; email: string; phone: string }

export type DbUserGroup = { id: string; name: string };