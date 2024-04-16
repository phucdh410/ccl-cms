import { CACHE_KEY } from "@/server/constant";
import prisma from "@/server/database";
import { nextReturn } from "@/utils/api";
import { Prisma } from "@prisma/client";
// import { kv } from "@vercel/kv";
import { NextRequest } from "next/server";

/**
 * Create course's result
 */
export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as Prisma.CourseResultCreateInput;
    const result = await prisma.courseResult.create({
      data,
    });
    // await kv.del(CACHE_KEY.COURSE_RESULT);
    return nextReturn(result);
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
