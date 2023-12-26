import prisma from "@/server/database";
import { nextReturn } from "@/utils/api";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

export async function GET(_: NextRequest, context: any) {
  const id = context.params.id;
  try {
    const result = await prisma.courseResult.findUnique({
      where: {
        id,
      },
    });
    if (!result)
      return nextReturn("Course's Result Not found", 400, "NOT_FOUND");
    return nextReturn(result);
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}

export async function PUT(request: NextRequest, context: any) {
  const id = context.params.id;
  const data = (await request.json()) as Prisma.CourseResultUpdateInput;
  try {
    const check = await prisma.courseResult.findUnique({
      where: {
        id,
      },
    });
    if (!check)
      return nextReturn("Course's Result Not found", 400, "NOT_FOUND");
    const result = await prisma.courseResult.update({
      where: {
        id,
      },
      data,
    });
    return nextReturn(result);
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}

export async function DELETE(_: NextRequest, context: any) {
  const id = context.params.id;
  try {
    const check = await prisma.courseResult.findUnique({
      where: {
        id,
      },
    });
    if (!check)
      return nextReturn("Course's Result Not found", 400, "NOT_FOUND");
    const result = await prisma.courseResult.delete({
      where: {
        id,
      },
    });
    return nextReturn(result);
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
