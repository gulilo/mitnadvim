export type DbUser = { id: string; email: string; password_hash: string; name: string; user_group_id: string };

export type DbUserGroup = { id: string; name: string; };