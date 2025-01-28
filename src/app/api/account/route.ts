import { hashPassword } from "@/lib/hash";
import { BadRequest } from "@/lib/httpErrorCodes";
import { prisma } from "@/lib/prisma";
import { Customer } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

/**
 * @openapi
 * 
 * /api/account:
 */


/**
 * @openapi
 * 
 * /api/account:
 *  post:
 *      tags:
 *          - account
 *      summary: Create account
 *      description: Creates a new account
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  example:
 *                      ssn: 0123456789ab
 *                      name: John Doe
 *                      email: john.doe@example.com
 *                      address: Fiction Street
 *                      phone_nr: 050 555 50 50
 *                      password: secure-password
 *      responses:
 *          200:
 *              description: Returns the account created
 */


type CreateAccountBody = {
    ssn: string,
    name: string,
    email: string,
    address: string,
    phone_nr: string,
    password: string,
}

type CreateAccountResponse = {
    ssn: string
}

/**
 * Create account
 * @desc: Creates a new customer account
 * @body: CreateAccountBody
 * @response: CreateAccountResponse
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

    const customer = await prisma.customer.create({
        data,
        select: {
            ssn: true,
        }
    });

    await prisma.basket.create({
        data: {
            customer_ssn: ssn,
        }
    })

    return NextResponse.json(customer)
}

/**
 * TODO: Maybe change so that we check session management. E.g. you can only access your own account. (or maybe admin can access, we'll see)
 * 
 * @openapi
 * 
 * /api/account:
 *  get:
 *      security:
 *          - cookieAuth: []
 *      summary: Get account
 *      description: Creates a new account 
 *      responses:
 *          200:
 *              description: Returns the account created
 *              content: 
 *          401:
 *              $ref: "#/components/responses/Unauthorized"
 */
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const ssn = searchParams.get("ssn");

    if(!ssn) return BadRequest();

    const customer = await prisma.customer.findUnique({
        where: {
            ssn: ssn,
        }
    })

    if(!customer) return BadRequest();

    return NextResponse.json(customer)
}

/**
 * TODO: Session management so only the owner can edit their account.
 * @openapi 
 *
 * /api/account:
 *  put:
 *      summary: Update account
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

    try {   
        await prisma.customer.update({
            data: {
                name,
                email,
                address,
                phone_nr
            },
            where: {
                ssn
            }
        })
    } catch {
        return BadRequest();
    }
        
    return NextResponse.json({success: true})
}


/**
 * TODO: Session management.
 * @openapi 
 *
 * /api/account:
 *  delete:
 *      summary: Update account
 */
export async function DELETE(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const ssn = searchParams.get("ssn");

    if(!ssn) return BadRequest();

    try {
        await prisma.customer.delete({
            where: {
                ssn: ssn
            }
        })
    } catch {
        return BadRequest();
    }
        
    return NextResponse.json({success: true})
}