import { NextResponse } from "next/server"

type CloneRequestBody = {
    id: string
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as Partial<CloneRequestBody>

        if (!body?.id) {
            return NextResponse.json(
                { success: false, error: "Missing 'id'" },
                { status: 400 }
            )
        }

        // Simulate async processing
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Deliberately fail the clone for testing UI error handling
        return NextResponse.json(
            { success: false, error: "Instance clone failure: CLONE_ERR_501" },
            { status: 500 }
        )
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid request body" },
            { status: 400 }
        )
    }
}


