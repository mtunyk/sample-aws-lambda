import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { date: string } }) {
  const data = {
    date: params.date,
  }

  return NextResponse.json(data)
}
