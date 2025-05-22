"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({ setupData, setSetupData }) {
  const [date, setDate] = React.useState();

  React.useEffect(() => {
    setSetupData({ ...setupData, deliverTime: date });
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal bg-transparent",
            !setupData.deliverTime && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {setupData.deliverTime ? (
            format(setupData.deliverTime, "PPP")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={setupData.deliverTime}
          // onSelect={setSetupData({ ...setupData, deliverTime: date })}
          onSelect={setDate}
          minDate={new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
