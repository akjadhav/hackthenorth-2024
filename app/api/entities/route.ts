import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Only POST method allowed' }, { status: 405 })
    }

    const entity = await req.json();

    console.log(entity);

    return NextResponse.json({ message: 'Updated space objects' }, { status: 200 });
}
