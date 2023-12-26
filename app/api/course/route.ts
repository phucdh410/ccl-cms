import prisma from "@/server/database";
import { nextReturn } from "@/utils/api";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

/**
 * Filter courses
 */
export async function GET(request: NextRequest) {
  try {
    const result = await prisma.course.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    return nextReturn(result);
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}

/**
 * Create new course
 */
export async function POST(request: NextRequest) {
  try {
    const input = (await request.json()) as Prisma.CourseCreateInput;
    const result = await prisma.course.create({
      data: input,
    });
    return nextReturn(result);
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
