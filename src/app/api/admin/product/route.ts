import { GetProducts } from "@/service/product";
import { NextResponse } from "next/server";

/**
 * Get all products
 */
export async function GET() {
    return NextResponse.json(await GetProducts())
}

/**
 * Create a new product
 */
export async function POST() {

}

/**
 * Update product information
 */
export async function PUT() {

}

/**
 * Delete product
 */
export async function DELETE() {

}