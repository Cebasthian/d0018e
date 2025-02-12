import { NextResponse } from "next/server";

const Error = (status: number, message: string) => (error?: unknown) => new NextResponse(JSON.stringify({
    message,
    error,
    status
}), {status}) 

/**
 * Error 400 Bad request
 */
export const BadRequest = Error(400, "Bad request")

/**
 * Error 401 Unauthorized
 */
export const Unauthorized = Error(401, "Unauthorized")

/**
 * Error 500 Internal error
 */
export const InternalError = Error(500, "Internal error")


/**
 * Status 200 OK
 */
export const SuccessResponse = () => NextResponse.json({success: true})
