import { NextResponse } from "next/server";

const nextReturn = (
  payload: any,
  status: number = 200,
  statusText?: string,
  headers?: any
) => {
  console.log("return");

  try {
    if (status > 300 || status < 200) {
      console.error("nextReturn error", JSON.stringify(payload));
      // send error to sentry

      // co post man hok ong

      return NextResponse.json(payload, {
        status,
        statusText: statusText,
      });
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
  } catch (err) {
    console.log("Return error", err);
  }
};

export { nextReturn };
