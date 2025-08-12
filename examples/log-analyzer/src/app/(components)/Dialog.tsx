"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import CalendarComponent from "./Calendar"

export default function DialogComponent() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="text-sm">Book a demo</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Book a demo</DialogTitle>
                </DialogHeader>
                <CalendarComponent />
            </DialogContent>
        </Dialog>
    )
}


