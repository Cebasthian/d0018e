import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({text: "get"})
}

export function POST() {
    return NextResponse.json({text: "post"})
    
}

export function PUT() {
    return NextResponse.json({text: "put"})
    
}

export function DELETE() {
    return NextResponse.json({text: "delete"})

}