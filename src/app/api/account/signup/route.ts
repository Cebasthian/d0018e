import { hashPassword } from "@/lib/server/hash";
import { BadRequest } from "@/lib/server/httpStatus";
import { CreateAccount } from "@/service/customer_account";
import { Customer } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type CreateAccountBody = {
    ssn: string,
    name: string,
    email: string,
    address: string,
    phone_nr: string,
    password: string,
}

/**
 * Create account
 * @desc: Creates a new customer account. Returns the newly created account
 * @body: CreateAccountBody
 */
export async function POST(req: NextRequest) {

    const body: CreateAccountBody = await req.json();
    const {
        ssn,
        name,
        email,
        address,
        phone_nr,
        password
    } = body;

    if(!ssn || !name || !email || !address || !phone_nr || !password) {
        return BadRequest("Invalid fields in body")
    }

    const data: Customer = {
        ssn,
        name,
        email,
        address,
        phone_nr,
        password: hashPassword(password),
        bonus_points: 0,
    }

    const customer = await CreateAccount(data);

    return NextResponse.json(customer)
}