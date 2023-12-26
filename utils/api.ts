import { NextResponse } from "next/server";

const nextReturn = (
  payload: any,
  status: number = 200,
  statusText?: string,
  headers?: any
) => {
  if (status > 300 || status < 200) {
    console.error("nextReturn error", JSON.stringify(payload));
    // send error to sentry
  }
  if (headers) {
    return NextResponse.json(payload, {
      status,
      statusText,
      headers,
    });
  }
  return NextResponse.json(payload, {
    status,
    statusText,
  });
};

export { nextReturn };
