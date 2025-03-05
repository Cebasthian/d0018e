import { withCustomerSession } from "@/lib/server/session/session_routes";
import { NextResponse } from "next/server";

/**
 * Get logged in account
 */
export const GET = withCustomerSession((req, customer) => {

    return NextResponse.json(customer)
})