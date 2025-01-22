import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function DateRange({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: {
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
}) {
  return (
    <div className="flex p-4 space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="start-date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal md:w-[200px]",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? (
              format(startDate, "LLL dd, y")
            ) : (
              <span>Pick start date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="single"
            selected={startDate}
            onSelect={(date) => date && setStartDate(date)}
            defaultMonth={startDate}
          />
        </PopoverContent>
      </Popover>
      <div className="flex items-center">-</div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="end-date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal md:w-[200px]",
              !endDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? (
              format(endDate, "LLL dd, y")
            ) : (
              <span>Pick end date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="single"
            selected={endDate}
            onSelect={(date) => date && setEndDate(date)}
            defaultMonth={endDate}
            fromDate={startDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
