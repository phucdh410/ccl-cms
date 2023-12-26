import { nextReturn } from "@/utils/api";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    return nextReturn({
        sucess: true,
    });
}
