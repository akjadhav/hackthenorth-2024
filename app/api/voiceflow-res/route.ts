import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      console.log('Data received:', body);

      return NextResponse.json(
        { message: 'POST request received', data: body },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
  } else {
    return NextResponse.json(
      { error: `Method ${req.method} Not Allowed` },
      { status: 405 }
    );
  }
}
