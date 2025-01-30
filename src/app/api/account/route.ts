import { BadRequest } from "@/lib/server/errorCodes";
import { hashPassword } from "@/lib/server/hash";
import { CreateAccount, DeleteAccount, FindAccount, UpdateAccount } from "@/service/account";
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

/**
 * Get account
 * @desc: TODO: Add session management
 */
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const ssn = searchParams.get("ssn");

    if(!ssn) return BadRequest();

    const customer = await FindAccount(ssn)

    if(!customer) return BadRequest();

    return NextResponse.json(customer)
}

/**
 * Update account
 * @desc: TODO: Add session management
 */
export async function PUT(req: NextRequest) {
    const body = await req.json();
    const {
        ssn,
        name,
        email,
        address,
        phone_nr,
    } = body;

    if(!ssn) return BadRequest("Invalid ssn field in body")

    try {   
        await UpdateAccount(ssn, {
            name,
            email,
            address,
            phone_nr
        })
    } catch(error: unknown) {
        return BadRequest(error);
    }
        
    return NextResponse.json({success: true})
}

/**
 * Delete account
 * @desc: TODO: Add session management
 */
export async function DELETE(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const ssn = searchParams.get("ssn");

    if(!ssn) return BadRequest("Invalid ssn parameter");

    try {
        await DeleteAccount(ssn)
    } catch(error: unknown) {
        return BadRequest(error);
    }
        
    return NextResponse.json({success: true})
}