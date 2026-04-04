import { getUsersByPartialName } from "@/app/(user)/data/user";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("search");

    const users = await getUsersByPartialName(searchQuery || "");
    return NextResponse.json(users);
}
