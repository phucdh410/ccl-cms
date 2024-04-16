import { nextReturn } from "@/utils/api";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  console.log("Uploaded");

  return nextReturn({
    success: true,
  });
}
