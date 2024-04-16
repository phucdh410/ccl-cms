import prisma from "@/server/database";
import { nextReturn } from "@/utils/api";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { kv } from "@vercel/kv";
import { CACHE_KEY } from "@/server/constant";
import supabase, { bucketName } from "@/supbase/supabase";

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
  try {
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
      // await kv.del(CACHE_KEY.COURSE_RESULT);
      return nextReturn(result);
    } catch (err: any) {
      return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
    }
  } catch (_) {
    console.log("PUT Error", _);
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

    if (result?.galleryImgs?.length) {
      //DELETE ALL FILES IN FOLDER
      const paths: string[] = [];
      const regex = new RegExp(`https://.+?/${bucketName}/(.+)$`);
      result.galleryImgs.forEach((e) => {
        const match = e.match(regex);
        if (match) paths.push(match[1]);
      });
      await supabase.storage.from(bucketName).remove(paths);

      //DELETE EMPTY FOLDER
      const parts = result.galleryImgs[0].split("/");
      const folderPath = parts[parts.length - 2];
      await supabase.storage.from(bucketName).remove([folderPath]);
    }
    // await kv.del(CACHE_KEY.COURSE_RESULT);

    return nextReturn(result);
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}

const filterFileDir = (path: string) => {
  const match = path.match(/CCL_BUCKET\/(.+)$/);
  if (match) return match[1];
  return path;
};
