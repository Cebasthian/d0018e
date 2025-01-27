import { hashPassword } from "@/lib/hash";
import { BadRequest } from "@/lib/httpErrorCodes";
import { prisma } from "@/lib/prisma";
import { Customer } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


/**
 * [C]reate customer endpoint
 * @param req 
 * @returns 
 */
export async function POST(req: NextRequest) {

    const body = await req.json();
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
    });

    await prisma.basket.create({
        data: {
            customer_ssn: ssn,
        }
    })

    return NextResponse.json(customer)
}

/**
 * [R]etrieve customer http://localhost:3000/api/account?ssn=AABBCC
 * @param req 
 * @returns 
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
 * [U]pdate customer
 * TODO: Fixa med session management så bara ägaren kan ändra ett konto.
 * @param req 
 * @returns 
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
 * [D]elete customer http://localhost:3000/api/account?ssn=AABBCC
 * TODO: Fixa med session management så bara ägaren kan ta bort ett konto.
 * @param req 
 * @returns 
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