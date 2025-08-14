import { NextResponse } from "next/server"

type ManageRequestBody = {
    id: string
    name: string
    type: string
    ramGB: number
    storageGB: number
    description?: string
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as Partial<ManageRequestBody>

        if (!body?.id || !body?.name || !body?.type || typeof body?.ramGB !== "number" || typeof body?.storageGB !== "number") {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Simulate async processing
        await new Promise((resolve) => setTimeout(resolve, 350))

        // Deliberately fail update for UI error handling
        return NextResponse.json(
            { success: false, error: "Instance update failed: MGMT_ERR_409" },
            { status: 500 }
        )
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid request body" },
            { status: 400 }
        )
    }
}


