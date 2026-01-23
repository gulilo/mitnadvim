"use client"

import { Calendar } from "@/app/components/ui/calendar"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { parseHebrewDate } from "@/app/lib/date-utils"


export default function CalendarComponent({propsDate}: {propsDate: string}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(parseHebrewDate(propsDate))
  const router = useRouter()
  const searchParams = useSearchParams()

  function onSelect(date: Date | undefined) {
    if (!date) return
    setSelectedDate(date)

    // Avoid re-navigation if same day is clicked
    if (
      selectedDate &&
      date.toDateString() === selectedDate.toDateString()
    ) {
      return
    }

    const params = new URLSearchParams(searchParams)
    // Use Hebrew locale format (DD.MM.YYYY) for URL parameter
    params.set("date", date.toLocaleDateString("he-IL"))

    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelect}
          defaultMonth={selectedDate || new Date()}
          captionLayout="dropdown"
          className="rounded-lg border w-full max-w-sm"
        />
  )
}
