"use client";

import DateRange from "@/components/date-range";
import { FlockSelector } from "@/components/flock-selector";
import { useFlocks } from "@/store/flocks";
import { addDays } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import FarmSettings, { FarmSettingsState } from "./settings";
import { getAll } from "@/lib/api";
import DateGrouper from "@/lib/date-group";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Spinner } from "@/components/ui/spinner";

export default function Finances() {
  const [startDate, setStartDate] = useState(addDays(new Date(), -7));
  const [endDate, setEndDate] = useState(new Date());

  const [group, setGroup] = useState<"daily" | "weekly" | "monthly">("daily");

  const [settings, setSettings] = useState<FarmSettingsState>({
    flocks: [],
    expenses: {
      birdPurchase: false,
      feedPurchase: false,
      vaccine: false,
      other: false,
    },
    income: {
      birdSale: false,
      eggsSale: false,
      feedSale: false,
      manure: false,
    },
  });

  const [isLoading, setIsLoading] = useState(true);

  const [flocks, setFlocks] = useState([]);

  const [birdPurchases, setBirdPurchases] = useState([]);
  const [feedPurchases, setFeedPurchases] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [others, setOthers] = useState([]);

  const [birdSales, setBirdSales] = useState([]);
  const [eggsSales, setEggsSales] = useState([]);
  const [feedSales, setFeedSales] = useState([]);
  const [manures, setManures] = useState([]);

  const fetchFlocks = useCallback(async () => {
    const response = await getAll("flock", {
      active: true,
    });
    setFlocks(response.data);
  }, []);

  const fetchBirdPurchases = useCallback(async () => {
    const response = await getAll("birdPurchase", {
      fromDate: startDate,
      toDate: endDate,
      flock: JSON.stringify(settings.flocks),
    });
    setBirdPurchases(
      response.data.map((purchase: any) => ({
        date: new Date(purchase.date),
        amount: purchase.rate * purchase.quantity,
      }))
    );
  }, [startDate, endDate, settings.flocks]);

  const fetchFeedPurchases = useCallback(async () => {
    const response = await getAll("feedPurchase", {
      fromDate: startDate,
      toDate: endDate,
    });
    setFeedPurchases(
      response.data.map((purchase: any) => ({
        date: new Date(purchase.date),
        amount: purchase.cost,
      }))
    );
  }, [startDate, endDate]);

  const fetchVaccines = useCallback(async () => {
    const response = await getAll("vaccine", {
      fromDate: startDate,
      toDate: endDate,
      flock: JSON.stringify(settings.flocks),
    });
    setVaccines(
      response.data.map((vaccine: any) => ({
        date: new Date(vaccine.date),
        amount: vaccine.cost,
      }))
    );
  }, [startDate, endDate, settings.flocks]);

  const fetchOthers = useCallback(async () => {
    const response = await getAll("other", {
      fromDate: startDate,
      toDate: endDate,
      flock: JSON.stringify(settings.flocks),
    });
    setOthers(
      response.data.map((other: any) => ({
        date: new Date(other.date),
        amount: other.cost,
      }))
    );
  }, [startDate, endDate, settings.flocks]);

  const fetchBirdSales = useCallback(async () => {
    const response = await getAll("birdSale", {
      fromDate: startDate,
      toDate: endDate,
      flock: JSON.stringify(settings.flocks),
    });
    setBirdSales(
      response.data.map((sale: any) => ({
        date: new Date(sale.date),
        amount: sale.rate * sale.quantity,
      }))
    );
  }, [startDate, endDate, settings.flocks]);

  const fetchEggsSales = useCallback(async () => {
    const response = await getAll("eggsSale", {
      fromDate: startDate,
      toDate: endDate,
      flock: JSON.stringify(settings.flocks),
    });
    setEggsSales(
      response.data.map((sale: any) => ({
        date: new Date(sale.date),
        amount: (sale.rate * sale.quantity) / 100,
      }))
    );
  }, [startDate, endDate, settings.flocks]);

  const fetchFeedSales = useCallback(async () => {
    const response = await getAll("feedSale", {
      fromDate: startDate,
      toDate: endDate,
    });
    setFeedSales(
      response.data.map((sale: any) => ({
        date: new Date(sale.date),
        amount: sale.cost,
      }))
    );
  }, [startDate, endDate]);

  const fetchManures = useCallback(async () => {
    const response = await getAll("manure", {
      fromDate: startDate,
      toDate: endDate,
      flock: JSON.stringify(settings.flocks),
    });
    setManures(
      response.data.map((manure: any) => ({
        date: new Date(manure.date),
        amount: manure.quantity * manure.rate,
      }))
    );
  }, [startDate, endDate, settings.flocks]);

  const fetcher = useCallback(async () => {
    setIsLoading(true);

    await Promise.all([
      fetchFlocks(),
      fetchBirdPurchases(),
      fetchBirdSales(),
      fetchFeedPurchases(),
      fetchVaccines(),
      fetchOthers(),
      fetchEggsSales(),
      fetchFeedSales(),
      fetchManures(),
    ]);

    setIsLoading(false);
  }, [
    fetchFlocks,
    fetchBirdPurchases,
    fetchFeedPurchases,
    fetchVaccines,
    fetchOthers,
    fetchBirdSales,
    fetchEggsSales,
    fetchFeedSales,
    fetchManures,
  ]);

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  const birdPurchaseDataSource = useMemo(() => {
    if (!settings.expenses.birdPurchase) return [];
    return new DateGrouper<any>(birdPurchases, "amount").group(group, "sum");
  }, [group, settings.expenses.birdPurchase, birdPurchases]);

  const feedPurchaseDataSource = useMemo(() => {
    if (!settings.expenses.feedPurchase) return [];
    return new DateGrouper<any>(feedPurchases, "amount").group(group, "sum");
  }, [group, settings.expenses.feedPurchase, feedPurchases]);

  const vaccineDataSource = useMemo(() => {
    if (!settings.expenses.vaccine) return [];
    return new DateGrouper<any>(vaccines, "amount").group(group, "sum");
  }, [group, settings.expenses.vaccine, vaccines]);

  const otherDataSource = useMemo(() => {
    if (!settings.expenses.other) return [];
    return new DateGrouper<any>(others, "amount").group(group, "sum");
  }, [group, settings.expenses.other, others]);
  const birdSaleDataSource = useMemo(() => {
    if (!settings.income.birdSale) return [];
    return new DateGrouper<any>(birdSales, "amount").group(group, "sum");
  }, [group, settings.income.birdSale, birdSales]);

  const feedSaleDataSource = useMemo(() => {
    if (!settings.income.feedSale) return [];
    return new DateGrouper<any>(feedSales, "amount").group(group, "sum");
  }, [group, settings.income.feedSale, feedSales]);

  const eggSaleDataSource = useMemo(() => {
    if (!settings.income.eggsSale) return [];
    return new DateGrouper<any>(eggsSales, "amount").group(group, "sum");
  }, [group, settings.income.eggsSale, eggsSales]);

  const manureDataSource = useMemo(() => {
    if (!settings.income.manure) return [];
    return new DateGrouper<any>(manures, "amount").group(group, "sum");
  }, [group, settings.income.manure, manures]);

  const birdPurchaseTotal = useMemo(() => {
    return Number(
      birdPurchaseDataSource
        .reduce((sum, p) => sum + Number(p.amount), 0)
        .toFixed(2)
    );
  }, [birdPurchaseDataSource]);

  const feedPurchaseTotal = useMemo(() => {
    return Number(
      feedPurchaseDataSource
        .reduce((sum, p) => sum + Number(p.amount), 0)
        .toFixed(2)
    );
  }, [feedPurchaseDataSource]);

  const vaccineTotal = useMemo(() => {
    return Number(
      vaccineDataSource.reduce((sum, p) => sum + Number(p.amount), 0).toFixed(2)
    );
  }, [vaccineDataSource]);

  const otherTotal = useMemo(() => {
    return Number(
      otherDataSource.reduce((sum, p) => sum + Number(p.amount), 0).toFixed(2)
    );
  }, [otherDataSource]);

  const birdSaleTotal = useMemo(() => {
    return Number(
      birdSaleDataSource
        .reduce((sum, p) => sum + Number(p.amount), 0)
        .toFixed(2)
    );
  }, [birdSaleDataSource]);

  const feedSaleTotal = useMemo(() => {
    return Number(
      feedSaleDataSource
        .reduce((sum, p) => sum + Number(p.amount), 0)
        .toFixed(2)
    );
  }, [feedSaleDataSource]);

  const eggSaleTotal = useMemo(() => {
    return Number(
      eggSaleDataSource.reduce((sum, p) => sum + Number(p.amount), 0).toFixed(2)
    );
  }, [eggSaleDataSource]);

  const manureTotal = useMemo(() => {
    return Number(
      manureDataSource.reduce((sum, p) => sum + Number(p.amount), 0).toFixed(2)
    );
  }, [manureDataSource]);

  const combinedData = useMemo(() => {
    const uniqueDates = new Set(
      [...birdPurchaseDataSource]
        .map((item) => item.date)
        .concat([...feedPurchaseDataSource].map((item) => item.date))
        .concat([...vaccineDataSource].map((item) => item.date))
        .concat([...otherDataSource].map((item) => item.date))
        .concat([...birdSaleDataSource].map((item) => item.date))
        .concat([...feedSaleDataSource].map((item) => item.date))
        .concat([...eggSaleDataSource].map((item) => item.date))
        .concat([...manureDataSource].map((item) => item.date))
    );
    return Array.from(uniqueDates).map((date) => ({
      date,
      birdPurchase:
        birdPurchaseDataSource.find((item) => item.date === date)?.amount || 0,
      feedPurchase:
        feedPurchaseDataSource.find((item) => item.date === date)?.amount || 0,
      vaccine:
        vaccineDataSource.find((item) => item.date === date)?.amount || 0,
      other: otherDataSource.find((item) => item.date === date)?.amount || 0,
      birdSale:
        birdSaleDataSource.find((item) => item.date === date)?.amount || 0,
      feedSale:
        feedSaleDataSource.find((item) => item.date === date)?.amount || 0,
      eggSale:
        eggSaleDataSource.find((item) => item.date === date)?.amount || 0,
      manure: manureDataSource.find((item) => item.date === date)?.amount || 0,
    }));
  }, [
    birdPurchaseDataSource,
    birdSaleDataSource,
    feedPurchaseDataSource,
    vaccineDataSource,
    otherDataSource,
    eggSaleDataSource,
    feedSaleDataSource,
    manureDataSource,
  ]);

  const barSources = [
    {
      key: "birdPurchase",
      color: "#FF6B6B",
      label: "Bird Purchase",
    },
    {
      key: "feedPurchase",
      color: "#4ECDC4",
      label: "Feed Purchase",
    },
    {
      key: "vaccine",
      color: "#45B7D1",
      label: "Vaccine",
    },
    {
      key: "other",
      color: "#96CEB4",
      label: "Other",
    },
    {
      key: "birdSale",
      color: "#7BE495",
      label: "Bird Sale",
    },
    {
      key: "feedSale",
      color: "#26A69A",
      label: "Feed Sale",
    },
    {
      key: "eggSale",
      color: "#FF9F1C",
      label: "Egg Sale",
    },
    {
      key: "manure",
      color: "#6C5B7B",
      label: "Manure",
    },
  ];

  return (
    <>
      <header className="border-b">
        <h1 className="px-4 py-4 text-xl font-semibold">Finance</h1>
      </header>

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

      <Separator className="mt-4" />
      <FarmSettings
        settings={settings}
        onSettingsChange={setSettings}
        flocks={flocks}
      />
      <Separator className="mt-4" />

      {isLoading && <Spinner />}

      {!isLoading && (
        <>
          <div className="px-4 py-4 space-y-6">
            <Card className="h-fit py-4">
              <CardContent>
                <ChartContainer config={{}}>
                  <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={combinedData}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <XAxis dataKey="date" fontSize={12} tickMargin={8} />
                        <YAxis fontSize={12} tickMargin={8} />
                        <ChartTooltip />
                        <Legend />
                        {barSources.map((source) => {
                          const isExpense = [
                            "birdPurchase",
                            "feedPurchase",
                            "vaccine",
                            "other",
                          ].includes(source.key);
                          const isIncome = [
                            "birdSale",
                            "feedSale",
                            "eggSale",
                            "manure",
                          ].includes(source.key);

                          if (
                            isExpense &&
                            !settings.expenses[
                              source.key as keyof typeof settings.expenses
                            ]
                          )
                            return null;
                          if (
                            isIncome &&
                            !settings.income[
                              source.key as keyof typeof settings.income
                            ]
                          )
                            return null;

                          return (
                            <Bar
                              key={source.key}
                              dataKey={source.key}
                              fill={source.color}
                              name={source.label}
                              stackId="a"
                            />
                          );
                        })}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          <div className="px-4 py-4 space-y-6">
            {settings.expenses.birdPurchase && (
              <div className="flex gap-2 font-medium leading-none">
                Total Bird Purchase: <span>{birdPurchaseTotal}</span>
              </div>
            )}

            {settings.expenses.feedPurchase && (
              <div className="flex gap-2 font-medium leading-none">
                Total Feed Purchase: <span>{feedPurchaseTotal}</span>
              </div>
            )}

            {settings.expenses.vaccine && (
              <div className="flex gap-2 font-medium leading-none">
                Total Vaccine: <span>{vaccineTotal}</span>
              </div>
            )}

            {settings.expenses.other && (
              <div className="flex gap-2 font-medium leading-none">
                Total Other: <span>{otherTotal}</span>
              </div>
            )}

            {settings.income.birdSale && (
              <div className="flex gap-2 font-medium leading-none">
                Total Bird Sale: <span>{birdSaleTotal}</span>
              </div>
            )}

            {settings.income.feedSale && (
              <div className="flex gap-2 font-medium leading-none">
                Total Feed Sale: <span>{feedSaleTotal}</span>
              </div>
            )}

            {settings.income.eggsSale && (
              <div className="flex gap-2 font-medium leading-none">
                Total Eggs Sale: <span>{eggSaleTotal}</span>
              </div>
            )}

            {settings.income.manure && (
              <div className="flex gap-2 font-medium leading-none">
                Total Manure: <span>{manureTotal}</span>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
