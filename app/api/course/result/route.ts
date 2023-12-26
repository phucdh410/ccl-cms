import prisma from "@/server/database";
import { nextReturn } from "@/utils/api";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

/**
 * Create course's result
 */
export async function POST(request: NextRequest) {
  const data: Prisma.CourseResultCreateInput = await request.json();
  try {
    const result = await prisma.courseResult.create({
      data,
    });
    return nextReturn(result);
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
