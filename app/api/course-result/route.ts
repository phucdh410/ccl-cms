import { CACHE_KEY } from "@/server/constant";
import prisma from "@/server/database";
import { courseResultMapping } from "@/server/response-mapping/course-result.mapping";
import { nextReturn } from "@/utils/api";
import { convertArrayToFormattedData } from "@/utils/convertArrayToFormattedData";
import { kv } from "@vercel/kv";
import { NextRequest } from "next/server";

const dateDisplayMapping = (dateDisplay: string | null): any[] => {
  if (!dateDisplay) return [];
  const dateDisplayRaw = dateDisplay
    .split(",")
    .map((item: string) => item.trim());
  return convertArrayToFormattedData(dateDisplayRaw);
}

export async function POST(request: NextRequest) {
  let headers: any = {}
  let result = [];
  try {
    result = await kv.get(CACHE_KEY.COURSE_RESULT) as [];
    if (!result) {
      headers['cache-control'] = 'MISS'

      result = await prisma.course.findMany({
        include: {
          courseResults: true,
        },
      });
      await kv.set(CACHE_KEY.COURSE_RESULT, result)
    } else {
      headers['cache-control'] = 'HIT'
    }
    const courseResults = result.flatMap((course) =>
      courseResultMapping(course)
    ).filter(Boolean);
    let dateDisplay: any[] = [];
    if (result[0]) {
      dateDisplay = dateDisplayMapping(result[0].dateDisplay)
    }
    return nextReturn({
      courseResults,
      dateDisplay,
    }, 200, undefined, headers);
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}