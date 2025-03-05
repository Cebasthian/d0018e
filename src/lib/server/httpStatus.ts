import { HttpErrorMessage } from "@/types";
import { NextResponse } from "next/server";

export const HttpError = (status: number, message: string, errorCode: string) => (error?: unknown) => new NextResponse<HttpErrorMessage>(JSON.stringify({
    message,
    error,
    status,
    errorCode: errorCode
}), {status}) 

/**
 * Error 400 Bad request
 */
export const BadRequest = HttpError(400, "Bad request", "BAD_REQUEST")

/**
 * Error 401 Unauthorized
 */
export const Unauthorized = HttpError(401, "Unauthorized", "UNAUTHORIZED")

/**
 * Error 500 Internal error
 */
export const InternalError = HttpError(500, "Internal error", "INTERNAL_ERROR")


/**
 * Status 200 OK
 */
export const SuccessResponse = (json?: unknown) => NextResponse.json({success: true, data: json})
