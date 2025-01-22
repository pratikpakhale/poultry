"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { FlockSelector } from "@/components/flock-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useFlocks } from "@/store/flocks";
import { create, getAll, remove } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { Trash2 } from "lucide-react";

export default function BirdManagement() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "inventory";

  const today = new Date();

  const { selectedFlock, fetchFlocks } = useFlocks();

  const [isLoading, setIsLoading] = useState(false);
  const [mortalities, setMortalities] = useState([]);
  const [newMortality, setNewMortality] = useState<{
    date: Date;
    quantity: number | null;
  }>({
    date: today,
    quantity: null,
  });

  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);

  const [newPurchase, setNewPurchase] = useState<{
    date: Date;
    quantity: number | null;
    rate: number | null;
  }>({
    date: today,
    quantity: null,
    rate: null,
  });

  const [newSale, setNewSale] = useState<{
    date: Date;
    quantity: number | null;
    rate: number | null;
  }>({
    date: today,
    quantity: null,
    rate: null,
  });

  const fetchMortalities = useCallback(async () => {
    if (!selectedFlock) {
      return;
    }

    const response = await getAll("birdMortality", {
      flock: selectedFlock._id,
    });
    setMortalities(response.data);
  }, [selectedFlock]);

  const fetchPurchases = useCallback(async () => {
    if (!selectedFlock) {
      return;
    }

    const response = await getAll("birdPurchase", {
      flock: selectedFlock._id,
    });
    setPurchases(response.data);
  }, [selectedFlock]);

  const fetchSales = useCallback(async () => {
    if (!selectedFlock) {
      return;
    }

    const response = await getAll("birdSale", {
      flock: selectedFlock._id,
    });
    setSales(response.data);
  }, [selectedFlock]);

  const fetchAll = async () => {
    setIsLoading(true);
    await fetchMortalities();
    await fetchPurchases();
    await fetchSales();
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedFlock) {
      fetchAll();
    }
  }, [selectedFlock]);

  const handleNewMortality = async () => {
    if (!selectedFlock) {
      return;
    }

    const response = await create("birdMortality", {
      flock: selectedFlock._id,
      ...newMortality,
    });
    if (response) {
      fetchAll();
      fetchFlocks();
      setNewMortality({
        date: today,
        quantity: null,
      });
    }
  };

  const handleDeleteMorality = async (id: string) => {
    if (!confirm("Are you sure you want to delete this mortality record?")) {
      return;
    }

    const response = await remove("birdMortality", id);
    if (response) {
      fetchAll();
      fetchFlocks();
    }
  };

  const handleNewPurchase = async () => {
    if (!selectedFlock) {
      return;
    }

    const response = await create("birdPurchase", {
      flock: selectedFlock._id,
      ...newPurchase,
    });
    if (response) {
      fetchAll();
      fetchFlocks();
      setNewPurchase({
        date: today,
        quantity: null,
        rate: null,
      });
    }
  };

  const handleNewSale = async () => {
    if (!selectedFlock) {
      return;
    }

    const response = await create("birdSale", {
      flock: selectedFlock._id,
      ...newSale,
    });
    if (response) {
      fetchAll();
      fetchFlocks();
      setNewSale({
        date: today,
        quantity: null,
        rate: null,
      });
    }
  };

  const handleDeletePurchase = async (id: string) => {
    if (!confirm("Are you sure you want to delete this purchase record?")) {
      return;
    }

    const response = await remove("birdPurchase", id);
    if (response) {
      fetchAll();
      fetchFlocks();
    }
  };

  const handleDeleteSale = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sale record?")) {
      return;
    }

    const response = await remove("birdSale", id);
    if (response) {
      fetchAll();
      fetchFlocks();
    }
  };

  return (
    <>
      <header className="border-b">
        <h1 className="px-4 py-4 text-xl font-semibold">Bird Management</h1>
      </header>

      <FlockSelector />

      <div className="p-4">
        <Tabs defaultValue={defaultTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inventory">Overview</TabsTrigger>
            <TabsTrigger value="mortality">Mortality</TabsTrigger>
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col justify-between p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Total Birds
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {selectedFlock
                        ? selectedFlock.quantity - selectedFlock.mortality
                        : 0}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Mortality Rate
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {selectedFlock
                        ? selectedFlock.quantity
                          ? (
                              (selectedFlock.mortality /
                                selectedFlock.quantity) *
                              100
                            ).toFixed(1)
                          : "0"
                        : "0"}
                      %
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Recent Activity</h3>
                  {isLoading && <Spinner />}
                  {!isLoading && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead className="text-right">Change</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          ...mortalities.map((m: any) => ({
                            date: new Date(m.date),
                            type: "Mortality",
                            change: m.quantity,
                          })),
                          ...purchases.map((p: any) => ({
                            date: new Date(p.date),
                            type: "Purchase",
                            change: p.quantity,
                          })),
                          ...sales.map((s: any) => ({
                            date: new Date(s.date),
                            type: "Sale",
                            change: s.quantity,
                          })),
                        ]
                          .sort((a, b) => b.date.getTime() - a.date.getTime())
                          .slice(0, 5)
                          .map((activity, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {format(activity.date, "MMM dd")}
                              </TableCell>
                              <TableCell>{activity.type}</TableCell>
                              <TableCell className={`text-right`}>
                                {activity.change}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mortality" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Record Mortality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mortality-date">Date</Label>
                    <Input
                      type="date"
                      id="mortality-date"
                      onChange={(e) =>
                        setNewMortality({
                          ...newMortality,
                          date: new Date(e.target.value),
                        })
                      }
                      value={newMortality.date.toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="death-count">Death Count</Label>
                    <Input
                      type="number"
                      id="death-count"
                      placeholder="Number of birds"
                      required
                      onChange={(e) =>
                        setNewMortality({
                          ...newMortality,
                          quantity: parseInt(e.target.value),
                        })
                      }
                      value={newMortality.quantity || ""}
                    />
                  </div>

                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleNewMortality}
                  >
                    Record Mortality
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Mortality Records</CardTitle>
              </CardHeader>
              {isLoading && <Spinner />}
              {!isLoading && (
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead className="text-right">Delete</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mortalities.map((mortality: any) => (
                        <TableRow key={mortality._id}>
                          <TableCell>
                            {format(new Date(mortality.date), "MMM dd")}
                          </TableCell>
                          <TableCell>{mortality.quantity}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size={"sm"}
                              onClick={() =>
                                handleDeleteMorality(mortality._id)
                              }
                            >
                              <Trash2 color="red" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="buy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Birds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchase-date">Date</Label>
                    <Input
                      value={newPurchase.date.toISOString().split("T")[0]}
                      onChange={(e) =>
                        setNewPurchase({
                          ...newPurchase,
                          date: new Date(e.target.value),
                        })
                      }
                      required
                      type="date"
                      id="purchase-date"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      value={newPurchase.quantity || ""}
                      onChange={(e) =>
                        setNewPurchase({
                          ...newPurchase,
                          quantity: parseInt(e.target.value),
                        })
                      }
                      required
                      type="number"
                      id="quantity"
                      placeholder="Number of birds"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rate">Rate per Bird (₹)</Label>
                    <Input
                      value={newPurchase.rate ?? ""}
                      onChange={(e) =>
                        setNewPurchase({
                          ...newPurchase,
                          rate: e.target.value ? parseInt(e.target.value) : 0,
                        })
                      }
                      required
                      type="number"
                      id="rate"
                      placeholder="Enter rate"
                    />
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex justify-between">
                      <span>Total Amount</span>
                      <span className="font-bold">
                        ₹
                        {newPurchase.quantity && newPurchase.rate
                          ? newPurchase.quantity * newPurchase.rate
                          : 0}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    type="button"
                    onClick={handleNewPurchase}
                  >
                    Record Purchase
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Purchase Records</CardTitle>
              </CardHeader>
              {isLoading && <Spinner />}
              {!isLoading && (
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="text-right">Delete</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchases.map((purchase: any) => (
                        <TableRow key={purchase._id}>
                          <TableCell>
                            {format(new Date(purchase.date), "MMM dd")}
                          </TableCell>
                          <TableCell>{purchase.quantity}</TableCell>
                          <TableCell>₹{purchase.rate}</TableCell>
                          <TableCell>
                            ₹{purchase.quantity * purchase.rate}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size={"sm"}
                              onClick={() => handleDeletePurchase(purchase._id)}
                            >
                              <Trash2 color="red" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sell Birds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sale-date">Date</Label>
                    <Input
                      value={newSale.date.toISOString().split("T")[0]}
                      onChange={(e) =>
                        setNewSale({
                          ...newSale,
                          date: new Date(e.target.value),
                        })
                      }
                      required
                      type="date"
                      id="sale-date"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      value={newSale.quantity || ""}
                      onChange={(e) =>
                        setNewSale({
                          ...newSale,
                          quantity: parseInt(e.target.value),
                        })
                      }
                      required
                      type="number"
                      id="quantity"
                      placeholder="Number of birds"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rate">Rate per Bird (₹)</Label>
                    <Input
                      value={newSale.rate ?? ""}
                      onChange={(e) =>
                        setNewSale({
                          ...newSale,
                          rate: e.target.value ? parseInt(e.target.value) : 0,
                        })
                      }
                      required
                      type="number"
                      id="rate"
                      placeholder="Enter rate"
                    />
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex justify-between">
                      <span>Total Amount</span>
                      <span className="font-bold">
                        ₹
                        {newSale.quantity && newSale.rate
                          ? newSale.quantity * newSale.rate
                          : 0}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    type="button"
                    onClick={handleNewSale}
                  >
                    Record Sale
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Sale Records</CardTitle>
              </CardHeader>
              {isLoading && <Spinner />}
              {!isLoading && (
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="text-right">Delete</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sales.map((sale: any) => (
                        <TableRow key={sale._id}>
                          <TableCell>
                            {format(new Date(sale.date), "MMM dd")}
                          </TableCell>
                          <TableCell>{sale.quantity}</TableCell>
                          <TableCell>₹{sale.rate}</TableCell>
                          <TableCell>₹{sale.quantity * sale.rate}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size={"sm"}
                              onClick={() => handleDeleteSale(sale._id)}
                            >
                              <Trash2 color="red" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </>
  );
}
