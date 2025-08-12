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
import { PhoneCall } from "lucide-react"

export default function DialogComponent() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="text-sm">Book a demo <PhoneCall className="w-4 h-4" /></Button>
            </DialogTrigger>
            <DialogContent className="min-h-fit! min-w-fit! overflow-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><PhoneCall className="w-4 h-4" /> Book a demo </DialogTitle>
                </DialogHeader>
                <CalendarComponent />
            </DialogContent>
        </Dialog>
    )
}


