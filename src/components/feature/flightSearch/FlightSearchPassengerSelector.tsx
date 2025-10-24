"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { CabinClass } from "@/types/flight";

export interface FlightSearchPassengerSelectorProps {
  cabinClass: CabinClass;
  passengers: number;
  onCabinClassChange: (cabinClass: CabinClass) => void;
  onPassengersChange: (passengers: number) => void;
  labels: {
    selectionTitle: string;
    cabinClass: {
      economy: string;
      business: string;
    };
    passenger: string;
  };
}

export function FlightSearchPassengerSelector({
  cabinClass,
  passengers,
  onCabinClassChange,
  onPassengersChange,
  labels,
}: FlightSearchPassengerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const increment = () => onPassengersChange(passengers + 1);
  const decrement = () =>
    onPassengersChange(Math.max(1, passengers - 1));

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="bg-[#2d3e50] hover:bg-[#3d4e60] border-0 text-white justify-center gap-3 px-6 py-6 h-auto rounded-md min-w-[120px]"
        >
          <User className="w-5 h-5" />
          <span className="text-2xl font-light">{passengers}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500">
            {labels.selectionTitle}
          </h3>

          <RadioGroup
            value={cabinClass}
            onValueChange={(value) => onCabinClassChange(value as CabinClass)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ECONOMY" id="economy" />
              <Label htmlFor="economy" className="cursor-pointer">
                {labels.cabinClass.economy}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="BUSINESS" id="business" />
              <Label htmlFor="business" className="cursor-pointer">
                {labels.cabinClass.business}
              </Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {labels.passenger}
            </Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decrement}
                disabled={passengers <= 1}
                className="h-10 w-10 rounded-md bg-transparent"
              >
                <span className="text-lg">−</span>
              </Button>
              <span className="text-xl font-medium w-12 text-center">
                {passengers}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={increment}
                className="h-10 w-10 rounded-md bg-transparent"
              >
                <span className="text-lg">+</span>
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
