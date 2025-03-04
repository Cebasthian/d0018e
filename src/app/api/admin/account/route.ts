import { hashPassword } from "@/lib/server/hash";
import { BadRequest } from "@/lib/server/httpStatus";
import { CreateAdminAccount, DeleteAdminAccount, FindAdminAccount, UpdateAdminAccount } from "@/service/admin_accounts";
import { Administrator } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type CreateAdminBody = {
    ssn: string,
    username: string,
    email: string,
    password: string,
}


/*
* Create an admin account
*/
export async function POST(req: NextRequest) {
    const body: CreateAdminBody = await req.json();
    const {
        ssn, 
        username, 
        email, 
        password
    } = body;

    const data: Administrator = {
        ssn,
        username,
        email,
        password: hashPassword(password),
    }

    const admin = await CreateAdminAccount(data);
    return NextResponse.json(admin);
}


/*
* Get administrator account
*/
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const ssn = searchParams.get("ssn");

    if(!ssn) return BadRequest("SSN required");

    const admin = await FindAdminAccount(ssn);
    
    if(!admin) return BadRequest("Administrator not found");

    return NextResponse.json(admin);
}


/*
* Update administrator account
*/
export async function PUT(req: NextRequest) {
    const body = await req.json();
    const { ssn, username, email} = body;

    if(!ssn) return BadRequest("Invalid ssn in body");

    try {
        await UpdateAdminAccount(ssn, {
            username,
            email
        });
    } catch(error: unknown) {
        return BadRequest(error);
    }

    return NextResponse.json({ success: true });
}


/* 
* Delete administrator account. 
*/
export async function DELETE(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const ssn = searchParams.get("ssn");

    if(!ssn) return BadRequest("Invalid ssn");

    try {
        await DeleteAdminAccount(ssn);
    } catch(error: unknown) {
        return BadRequest(error);
    }

    return NextResponse.json({ success: true });
}