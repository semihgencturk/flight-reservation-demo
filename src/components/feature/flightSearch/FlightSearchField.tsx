import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";

export interface FlightSearchFieldProps {
  icon: ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function FlightSearchField({
  icon,
  placeholder,
  value,
  onChange,
}: FlightSearchFieldProps) {
  return (
    <div className="flex-1 bg-white rounded-md">
      <div className="flex items-center gap-3 px-4 py-3">
        {icon}
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
        />
      </div>
    </div>
  );
}
