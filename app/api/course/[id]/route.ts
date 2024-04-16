import { CACHE_KEY } from "@/server/constant";
import prisma from "@/server/database";
import supabase, { bucketName } from "@/supbase/supabase";
import { nextReturn } from "@/utils/api";
import { Prisma } from "@prisma/client";
import { kv } from "@vercel/kv";
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
    const result = await prisma.course.update({
      where: {
        id,
      },
      data: input,
    });
    // await kv.del(CACHE_KEY.COURSE_RESULT);
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

    if (course?.galleryImgs?.length) {
      //DELETE ALL FILES IN FOLDER
      const paths: string[] = [];
      const regex = new RegExp(`https://.+?/${bucketName}/(.+)$`);
      course.galleryImgs.forEach((e) => {
        const match = e.match(regex);
        if (match) paths.push(match[1]);
      });
      await supabase.storage.from(bucketName).remove(paths);

      //DELETE EMPTY FOLDER
      const parts = course.galleryImgs[0].split("/");
      const folderPath = parts[parts.length - 2];
      await supabase.storage.from(bucketName).remove([folderPath]);
    }

    return nextReturn(course);
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
