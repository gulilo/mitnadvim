"use server";

import { auth } from "@/auth";
import { getAccountByAccountId, getAreaName, getUserByAccountId, getUserTags, getTagName, getTagCategory } from "../data/user";
import { DbTag, DbUser } from "../data/definitions";
import { DbAccount } from "../data/definitions";

export type ProfileData = {
  user: DbUser;
  account: DbAccount;
  areaName: string;
  tags: DbTag[];
}

export async function getProfileData() {
  try {
    const session = await auth();
    if (!session?.user) {
      return null;
    }

    const user = await getUserByAccountId(session.user.id);
    if (!user) {
      return null;
    }

    const account = await getAccountByAccountId(session.user.id);
    const areaName = await getAreaName(user.area_id);
    const tags = await getUserTags(session.user.id);

    return {
      user,
      account,
      areaName,
      tags,
    } as ProfileData;
  } catch (error) {
    console.error('Failed to fetch profile data:', error);
    return null;
  }
}

export async function getTagsData(tagIds: string[]) {
  try {
    const tagCategories = await Promise.all(
      tagIds.map(async (tagId) => {
        return await getTagCategory(tagId);
      })
    );

    const tagNames = await Promise.all(
      tagIds.map(async (tagId) => {
        return await getTagName(tagId);
      })
    );

    const tags = tagNames.map((tagName, index) => {
      return {
        name: tagName,
        category: tagCategories[index],
      };
    });

    return tags;
  } catch (error) {
    console.error('Failed to fetch tags data:', error);
    return [];
  }
}