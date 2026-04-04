import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function POST(request: NextRequest) {
  const { items } = await request.json();
  await prisma?.$transaction(
    items.map((item: { id: string; order: number }) =>
      prisma?.launch_point.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    ),
  );
  return NextResponse.json({ message: "Items reordered" });
}
