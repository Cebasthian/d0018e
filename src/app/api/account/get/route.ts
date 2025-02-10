import { withCustomerSession } from "@/lib/server/session/session_routes";
import { NextResponse } from "next/server";

export const GET = withCustomerSession((req, customer) => {

    return NextResponse.json(customer)
})