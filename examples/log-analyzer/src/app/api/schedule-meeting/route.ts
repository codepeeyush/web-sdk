import { NextResponse } from "next/server"

type BookRequestBody = {
    date: string // ISO date string (YYYY-MM-DD or ISO full)
    time: string // HH:mm
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as Partial<BookRequestBody>

        if (!body?.date || !body?.time) {
            return NextResponse.json(
                { success: false, error: "Missing 'date' or 'time'" },
                { status: 400 }
            )
        }

        // Simulate async processing
        await new Promise((resolve) => setTimeout(resolve, 250))

        // Deliberately fail the booking for testing UI error handling
        return NextResponse.json(
            { success: false, error: "Meeting scheduling failure: ZX9-ERR-42" },
            { status: 500 }
        )
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid request body" },
            { status: 400 }
        )
    }
}


