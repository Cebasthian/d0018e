import { NextResponse } from "next/server";

export const BadRequest = () => new NextResponse(JSON.stringify({error: "Bad request", status: 401}), {status: 401})