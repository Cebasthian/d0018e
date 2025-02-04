import { NextResponse } from "next/server";

const Error = (status: number, message: string) => (error?: unknown) => new NextResponse(JSON.stringify({
    message,
    error,
    status
}), {status}) 

export const BadRequest = Error(400, "Bad request")
export const InternalError = Error(500, "Internal error")

export const SuccessResponse = () => NextResponse.json({success: true})

// export const BadRequest = (error: unknown) => new NextResponse(JSON.stringify({message: "Bad request", error: error, status: 400}), {status: 400})