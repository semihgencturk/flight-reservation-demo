"use client";

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export interface FlightSearchDatePickerProps {
  date: Date | undefined;
  locale: string;
  placeholder: string;
  onChange: (date: Date | undefined) => void;
}

export function FlightSearchDatePicker({
  date,
  locale,
  placeholder,
  onChange,
}: FlightSearchDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex-1 bg-[#2d3e50] hover:bg-[#3d4e60] border-0 text-white justify-start gap-3 px-4 py-6 h-auto rounded-md"
        >
          <CalendarIcon className="w-5 h-5" />
          <span className="text-base font-normal">
            {date ? date.toLocaleDateString(locale) : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            onChange(selectedDate);
            setIsOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
