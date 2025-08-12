"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import CalendarComponent from "./Calendar"
import { PhoneCall } from "lucide-react"
import { toast } from "sonner"

export default function DialogComponent() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)

    async function handleScheduleMeeting() {
        if (!selectedDate || !selectedTime) return
        try {
            const res = await fetch("/api/schedule-meeting", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date: selectedDate.toISOString().slice(0, 10),
                    time: selectedTime,
                }),
            })
            const data = await res.json()
            if (res.ok && data?.success) {
                toast.success("Your meeting has been booked.")
            } else {
                console.log("ZX-FAIL-Ω#@!", { status: res.status, data })
                toast.error(data?.error ?? "Failed to book your meeting.", { duration: Infinity })
            }
        } catch {
            console.log("ZX-FAIL-Ω#@!", { status: "network-error" })
            toast.error("Something went wrong. Please try again.", { duration: Infinity })
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" className="text-sm">Book a demo <PhoneCall className="w-4 h-4" /></Button>
            </DialogTrigger>
            <DialogContent className="min-h-fit! min-w-fit! overflow-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 mb-4"><PhoneCall className="w-4 h-4" /> Book a demo </DialogTitle>
                </DialogHeader>
                <CalendarComponent
                    onSelectionChange={({ date, time }) => {
                        setSelectedDate(date)
                        setSelectedTime(time)
                    }}
                />
                <DialogFooter className="mt-2 w-full rounded-md border-t bg-secondary px-6 py-5 flex gap-4 flex-col md:flex-row items-center justify-between">
                    <div className="text-sm flex-1 min-w-0">
                        {selectedDate && selectedTime ? (
                            <>
                                Your meeting is booked for{" "}
                                <span className="font-medium">
                                    {" "}
                                    {selectedDate?.toLocaleDateString("en-US", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                    })}{" "}
                                </span>
                                at <span className="font-medium">{selectedTime}</span>.
                            </>
                        ) : (
                            <>Select a date and time for your meeting.</>
                        )}
                    </div>
                    <Button
                        disabled={!selectedDate || !selectedTime}
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto sm:ml-4"
                        onClick={handleScheduleMeeting}
                    >
                        Schedule Meeting
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


