"use client"

import { useState } from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function CalendarComponent() {
  const today = new Date()
  const [date, setDate] = useState<Date>(today)
  const [time, setTime] = useState<string | null>(null)

  // Mock time slots data
  const timeSlots = [
    { time: "09:00", available: false },
    { time: "09:30", available: false },
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: true },
    { time: "12:00", available: false },
    { time: "12:30", available: true },
    { time: "13:00", available: true },
    { time: "13:30", available: true },
    { time: "14:00", available: true },
    { time: "14:30", available: false },
    { time: "15:00", available: false },
    { time: "15:30", available: true },
    { time: "16:00", available: true },
    { time: "16:30", available: true },
    { time: "17:00", available: true },
    { time: "17:30", available: true },
  ]

  return (
    <div className="rounded-md border w-full max-w-4xl">
      <div className="flex max-sm:flex-col">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            if (newDate) {
              setDate(newDate)
              setTime(null)
            }
          }}
          className="p-4 sm:pe-8"
          classNames={{
            day_button: "size-12 md:size-14 text-base",
            day: "size-12 md:size-14 text-base",
            weekday: "size-12 md:size-14 text-sm",
            month_caption: "h-10 md:h-12",
            caption_label: "text-base md:text-lg",
          }}
          disabled={[
            { before: today },
          ]}
        />
        <div className="relative w-full max-sm:h-72 sm:w-80">
          <div className="absolute inset-0 py-4 max-sm:border-t">
            <ScrollArea className="h-full sm:border-s">
              <div className="space-y-3">
                <div className="flex h-5 shrink-0 items-center px-5">
                  <p className="text-sm font-medium">
                    {format(date, "EEEE, d")}
                  </p>
                </div>
                <div className="grid gap-2 px-5 max-sm:grid-cols-2">
                  {timeSlots.map(({ time: timeSlot, available }) => (
                    <Button
                      key={timeSlot}
                      variant={time === timeSlot ? "default" : "outline"}
                      size="default"
                      className="w-full"
                      onClick={() => setTime(timeSlot)}
                      disabled={!available}
                    >
                      {timeSlot}
                    </Button>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
