import prisma from "@/server/database";
import { courseResultMapping } from "@/server/response-mapping/course-result.mapping";
import { nextReturn } from "@/utils/api";
import { NextRequest } from "next/server";

const headers = {
  "Cache-Control": "public, s-maxage=5",
  "CDN-Cache-Control": "public, s-maxage=60",
};

export async function GET(request: NextRequest) {
  try {
    const result = await prisma.course.findMany({
      include: {
        courseResults: true,
      },
    });
    const mappedResult = result.flatMap((course: any) =>
      courseResultMapping(course)
    );
    return nextReturn(mappedResult, 200, undefined, headers);
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
