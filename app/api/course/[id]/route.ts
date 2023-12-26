import prisma from "@/server/database";
import { nextReturn } from "@/utils/api";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

/**
 * Get course by id
 */
export async function GET(request: NextRequest, context: any) {
  const id = context.params.id;

  try {
    const course = await prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        courseResults: {
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    });
    if (!course) return nextReturn("Course Not found", 400, "NOT_FOUND");
    return nextReturn(course);
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}

/**
 * Update course by id
 */
export async function PUT(request: NextRequest, context: any) {
  const id = context.params.id;

  try {
    const check = await prisma.course.findUnique({
      where: {
        id,
      },
    });
    if (!check) return nextReturn("Course Not found", 400, "NOT_FOUND");
    const input = (await request.json()) as Prisma.CourseUpdateInput;
    console.log("input", input);
    const result = await prisma.course.update({
      where: {
        id,
      },
      data: input,
    });
    return nextReturn(result);
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}

/**
 * Delete course by id
 */
export async function DELETE(request: NextRequest, context: any) {
  const id = context.params.id;
  try {
    const check = await prisma.course.findUnique({
      where: {
        id,
      },
    });
    if (!check) return nextReturn("Course Not found", 400, "NOT_FOUND");
    const [_, course] = await prisma.$transaction([
      prisma.courseResult.deleteMany({
        where: {
          courseId: id,
        },
      }),
      prisma.course.delete({
        where: {
          id,
        },
      }),
    ]);
    return nextReturn(course);
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
