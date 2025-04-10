"use client"

import type * as React from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css" // Impor CSS default

export type CalendarSimpleProps = React.ComponentProps<typeof DayPicker>

function CalendarSimple(props: CalendarSimpleProps) {
  return <DayPicker className="border rounded-md bg-white p-3" {...props} />
}

export { CalendarSimple }

