import { NextRequest, NextResponse } from "next/server";

// import path specific middleware


export function middleware(req: NextRequest) {

    // run path specific middleware

    return NextResponse.next();
}

export const config = {
    // path specific matcher
}