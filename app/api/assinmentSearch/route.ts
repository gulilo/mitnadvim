import { getUsersByPartialName } from "@/app/(user)/data/user";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    console.log("request",request);

    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("search");
    console.log("searchQuery",searchQuery);

    const users = await getUsersByPartialName(searchQuery || "");
    console.log("users",users);
    return NextResponse.json(users);
}
