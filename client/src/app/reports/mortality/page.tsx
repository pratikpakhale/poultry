"use client";

import { FlockSelector } from "@/components/flock-selector";

import DateRange from "@/components/date-range";
import { useCallback, useEffect, useMemo, useState } from "react";
import { addDays, format, getMonth, getWeek } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getAll } from "@/lib/api";
import { useFlocks } from "@/store/flocks";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import DateGrouper from "@/lib/date-group";

interface Mortality {
  date: Date;
  quantity: number;
}

export default function EggReports() {
  const [startDate, setStartDate] = useState(addDays(new Date(), -7));
  const [endDate, setEndDate] = useState(new Date());

  const [group, setGroup] = useState<"daily" | "weekly" | "monthly">("daily");

  const [mortalities, setMortalities] = useState<Mortality[]>([]);

  const { selectedFlock } = useFlocks();

  const fetchMortalities = useCallback(async () => {
    if (!selectedFlock) {
      return;
    }

    const response = await getAll("birdMortality", {
      flock: selectedFlock._id,
      fromDate: startDate,
      toDate: endDate,
    });

    setMortalities(response.data);
  }, [selectedFlock, startDate, endDate]);

  useEffect(() => {
    fetchMortalities();
  }, [fetchMortalities]);

  const mortalityDataSource = useMemo(() => {
    return new DateGrouper<Mortality>(mortalities, "quantity").group(
      group,
      "sum"
    );
  }, [mortalities, group]);

  const averageMortality = useMemo(() => {
    if (mortalityDataSource.length === 0) return 0;

    const total = mortalityDataSource.reduce(
      (sum, m) => sum + Number(m.quantity),
      0
    );
    return Number((total / mortalityDataSource.length).toFixed(2));
  }, [mortalities]);

  const totalMortality = useMemo(() => {
    return mortalityDataSource.reduce((sum, m) => sum + Number(m.quantity), 0);
  }, [mortalities]);

  console.log(mortalityDataSource);

  return (
    <>
      <header className="border-b">
        <h1 className="px-4 py-4 text-xl font-semibold">Bird Mortality</h1>
      </header>

      <FlockSelector />

      <DateRange
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <div className="px-4">
        <Select value={group} onValueChange={(value) => setGroup(value as any)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="px-4 py-4 space-y-6">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Mortality v/s Date</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                quantity: {
                  label: "Quantity",
                },
              }}
            >
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {group === "daily" ? (
                    <LineChart
                      data={mortalityDataSource}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <XAxis dataKey="date" fontSize={12} tickMargin={8} />
                      <YAxis fontSize={12} tickMargin={8} />
                      <ChartTooltip />
                      <Line
                        type="monotone"
                        dataKey="quantity"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  ) : (
                    <BarChart
                      data={mortalityDataSource}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <XAxis dataKey="date" fontSize={12} tickMargin={8} />
                      <YAxis fontSize={12} tickMargin={8} />
                      <ChartTooltip />
                      <Bar dataKey="quantity" fill="#8884d8" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Average Mortality: <span>{averageMortality}</span>
            </div>
            <div className="flex gap-2 font-medium leading-none">
              Total Mortality: <span>{totalMortality}</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
