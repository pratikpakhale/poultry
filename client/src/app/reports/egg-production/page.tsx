"use client";

import DateRange from "@/components/date-range";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addDays } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { getAll } from "@/lib/api";
import DateGrouper from "@/lib/date-group";
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

interface EggProduction {
  date: Date;
  quantity: number;
  [key: string]: unknown;
}

interface EggSale {
  date: Date;
  rate: number;
  [key: string]: unknown;
}

export default function EggReports() {
  const [startDate, setStartDate] = useState(addDays(new Date(), -7));
  const [endDate, setEndDate] = useState(new Date());

  const [group, setGroup] = useState<"daily" | "weekly" | "monthly">("daily");

  const [eggProductions, setEggProductions] = useState<EggProduction[]>([]);
  const [eggSales, setEggSales] = useState<EggSale[]>([]);

  const { selectedFlock } = useFlocks();

  const fetchEggProductions = useCallback(async () => {
    if (!selectedFlock) {
      return;
    }

    const response = await getAll("eggsProduction", {
      flock: selectedFlock._id,
      fromDate: startDate,
      toDate: endDate,
    });

    setEggProductions(response.data);
  }, [startDate, endDate, selectedFlock]);

  const fetchEggSales = useCallback(async () => {
    if (!selectedFlock) {
      return;
    }

    const response = await getAll("eggsSale", {
      flock: selectedFlock._id,
      fromDate: startDate,
      toDate: endDate,
    });

    setEggSales(response.data);
  }, [startDate, endDate, selectedFlock]);

  useEffect(() => {
    fetchEggProductions();
    fetchEggSales();
  }, [fetchEggProductions, fetchEggSales]);

  const productionDataSource = useMemo(() => {
    return new DateGrouper<EggProduction>(eggProductions, "quantity").group(
      group,
      "sum"
    );
  }, [eggProductions, group]);

  const salesDataSource = useMemo(() => {
    return new DateGrouper<EggSale>(eggSales, "rate").group(group, "average");
  }, [eggSales, group]);

  const averageProduction = useMemo(() => {
    if (productionDataSource.length === 0) return 0;
    const total = productionDataSource.reduce(
      (sum, p) => sum + Number(p.quantity),
      0
    );
    return Number((total / productionDataSource.length).toFixed(2));
  }, [productionDataSource]);

  const totalProduction = useMemo(() => {
    return productionDataSource.reduce((sum, p) => sum + Number(p.quantity), 0);
  }, [productionDataSource]);

  const averageRate = useMemo(() => {
    if (salesDataSource.length === 0) return 0;
    const total = salesDataSource.reduce((sum, p) => sum + Number(p.rate), 0);
    return Number((total / salesDataSource.length).toFixed(2));
  }, [salesDataSource]);

  return (
    <>
      <header className="border-b">
        <h1 className="px-4 py-4 text-xl font-semibold">Eggs Production</h1>
      </header>

      <DateRange
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <div className="px-4">
        <Select
          value={group}
          onValueChange={(value) =>
            setGroup(value as "daily" | "weekly" | "monthly")
          }
        >
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
            <CardTitle>Production v/s Date</CardTitle>
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
                      data={productionDataSource}
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
                      data={productionDataSource}
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
              Average Production: <span>{averageProduction}</span>
            </div>
            <div className="flex gap-2 font-medium leading-none">
              Total Production: <span>{totalProduction}</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="px-4 py-4 space-y-6">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Rate v/s Date</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                rate: {
                  label: "Rate",
                },
              }}
            >
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {group === "daily" ? (
                    <LineChart
                      data={salesDataSource}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <XAxis dataKey="date" fontSize={12} tickMargin={8} />
                      <YAxis fontSize={12} tickMargin={8} />
                      <ChartTooltip />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  ) : (
                    <BarChart
                      data={salesDataSource}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <XAxis dataKey="date" fontSize={12} tickMargin={8} />
                      <YAxis fontSize={12} tickMargin={8} />
                      <ChartTooltip />
                      <Bar dataKey="rate" fill="#8884d8" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Average Rate: <span>{averageRate}</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
