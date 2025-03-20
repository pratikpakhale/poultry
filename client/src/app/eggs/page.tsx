"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FlockSelector } from "@/components/flock-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { create, getAll, remove } from "@/lib/api";
import { useFlocks } from "@/store/flocks";
import { Spinner } from "@/components/ui/spinner";
import { Trash2 } from "lucide-react";

export default function EggManagement() {
  const searchParams = useSearchParams();
  const [currentTab, setCurrentTab] = useState(
    searchParams.get("tab") || "inventory"
  );

  const { selectedFlock } = useFlocks();

  const [isLoading, setIsLoading] = useState(false);

  const [productions, setProductions] = useState([]);
  const [newProduction, setNewProduction] = useState({
    date: new Date().toISOString().split("T")[0],
    quantity: "",
    type: "",
    flock: selectedFlock?._id,
  });

  const [sales, setSales] = useState([]);
  const [newSale, setNewSale] = useState({
    date: new Date().toISOString().split("T")[0],
    customer: "",
    quantity: "",
    rate: "",
    amountPaid: "",
    flock: selectedFlock?._id,
  });

  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
  });

  const [recentActivity, setRecentActivity] = useState<
    {
      date: Date;
      category: string;
      additional: string;
      quantity: number;
    }[]
  >([]);

  const [selectedCustomerFilter, setSelectedCustomerFilter] = useState("all");

  const fetchProductions = useCallback(async () => {
    if (!selectedFlock) return;
    const response = await getAll("eggsProduction", {
      flock: selectedFlock?._id,
    });
    if (response) {
      setProductions(response.data);
    }
  }, [selectedFlock]);

  const fetchSales = useCallback(async () => {
    if (!selectedFlock) return;
    const response = await getAll("eggsSale", {
      flock: selectedFlock?._id,
      populate: "customer",
    });
    if (response) {
      setSales(response.data);
    }
  }, [selectedFlock]);

  const fetchCustomers = useCallback(async () => {
    const response = await getAll("customer");
    if (response) {
      setCustomers(response.data);
    }
  }, []);

  const fetchRecentActivity = useCallback(async () => {
    if (!selectedFlock) return;

    const combinedActivity = [
      ...productions.map((p: any) => ({
        date: new Date(p.date),
        category: "Production",
        additional: p.type === "normal" ? "Normal" : "Cracked",
        quantity: Number(p.quantity),
      })),
      ...sales.map((s: any) => ({
        date: new Date(s.date),
        category: "Sale",
        additional: s.customer?.name || "Unknown",
        quantity: Number(s.quantity),
      })),
    ];

    combinedActivity.sort((a, b) => b.date.getTime() - a.date.getTime());
    setRecentActivity(combinedActivity);
  }, [productions, sales, selectedFlock]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchProductions(), fetchSales(), fetchCustomers()]);
      setIsLoading(false);
    };
    fetchData();
  }, [selectedFlock, fetchProductions, fetchSales, fetchCustomers]);

  useEffect(() => {
    fetchRecentActivity();
  }, [fetchRecentActivity]);

  const handleNewProduction = async () => {
    const response = await create("eggsProduction", {
      ...newProduction,
      flock: selectedFlock?._id,
    });

    if (response) {
      fetchProductions();
      setNewProduction({
        date: new Date().toISOString().split("T")[0],
        quantity: "",
        type: "",
        flock: selectedFlock?._id,
      });
    }
  };

  const handleDeleteProduction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this production?")) {
      return;
    }

    const response = await remove("eggsProduction", id);

    if (response) {
      fetchProductions();
    }
  };

  const handleNewCustomer = async () => {
    if (!newCustomer.name.trim()) {
      alert("Please enter a customer name");
      return;
    }

    const response = await create("customer", newCustomer);

    if (response) {
      fetchCustomers();
      setNewCustomer({ name: "" });
    }
  };

  const handleNewSale = async () => {
    const saleAmount = (Number(newSale.quantity) * Number(newSale.rate)) / 100;
    if (!newSale.amountPaid) {
      newSale.amountPaid = saleAmount.toString();
    }

    const response = await create("eggsSale", {
      ...newSale,
      flock: selectedFlock?._id,
    });

    if (response) {
      fetchSales();
      fetchCustomers();
      setNewSale({
        date: new Date().toISOString().split("T")[0],
        customer: "",
        quantity: "",
        rate: "",
        amountPaid: "",
        flock: selectedFlock?._id,
      });
    }
  };

  const handleDeleteSale = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sale?")) {
      return;
    }
    const response = await remove("eggsSale", id);

    if (response) {
      fetchSales();
      fetchCustomers();
    }
  };

  const calculateTotalSale = () => {
    if (!newSale.quantity || !newSale.rate) return 0;
    return (Number(newSale.quantity) * Number(newSale.rate)) / 100;
  };

  const getPaymentStatus = (sale: any) => {
    const totalAmount = (sale.quantity * sale.rate) / 100;
    const difference = sale.amountPaid - totalAmount;

    if (Math.abs(difference) < 0.01) return "Exact";
    if (difference > 0) return `+${difference.toFixed(2)}`;
    return difference.toFixed(2);
  };

  const getFilteredSales = () => {
    if (selectedCustomerFilter === "all") return sales;
    return sales.filter(
      (sale: any) => sale.customer?._id === selectedCustomerFilter
    );
  };

  return (
    <>
      <header className="border-b">
        <h1 className="px-4 py-4 text-xl font-semibold">Egg Management</h1>
      </header>

      <FlockSelector />

      <div className="p-4">
        <Tabs
          value={currentTab}
          onValueChange={setCurrentTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Current Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="text-lg font-medium">
                    Total Eggs Available
                  </span>
                  <span className="text-2xl font-bold">
                    {selectedFlock?.eggs}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Recent Activity</h3>
                  {isLoading && <Spinner />}
                  {!isLoading && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">
                            Additional
                          </TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentActivity.map((activity, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {format(activity.date, "MMM dd")}
                            </TableCell>
                            <TableCell>{activity.category}</TableCell>
                            <TableCell className="text-right">
                              {activity.additional}
                            </TableCell>
                            <TableCell className="text-right">
                              {activity.quantity}
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

          <TabsContent value="production">
            <Card>
              <CardHeader>
                <CardTitle>Add Production</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="production-date">Date</Label>
                    <Input
                      type="date"
                      id="production-date"
                      value={newProduction.date}
                      onChange={(e) =>
                        setNewProduction({
                          ...newProduction,
                          date: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="egg-count">Number of Eggs</Label>
                    <Input
                      type="number"
                      id="egg-count"
                      placeholder="Enter quantity"
                      value={newProduction.quantity}
                      onChange={(e) =>
                        setNewProduction({
                          ...newProduction,
                          quantity: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="egg-type">Type</Label>
                    <Select
                      value={newProduction.type}
                      onValueChange={(e) =>
                        setNewProduction({ ...newProduction, type: e })
                      }
                      required
                    >
                      <SelectTrigger id="egg-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="cracked">Cracked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </form>

                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNewProduction();
                  }}
                >
                  Add Production
                </Button>
              </CardContent>
            </Card>
            {isLoading && <Spinner />}

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Recent Productions</CardTitle>
              </CardHeader>
              {!isLoading && (
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productions.map((production: any) => (
                        <TableRow key={production._id}>
                          <TableCell>
                            {format(new Date(production.date), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell>
                            {production.type === "normal"
                              ? "Normal"
                              : "Cracked"}
                          </TableCell>
                          <TableCell className="text-right">
                            {production.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant={"ghost"}
                              onClick={() =>
                                handleDeleteProduction(production._id)
                              }
                            >
                              <Trash2 size={16} color="red" />
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

          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Record Sale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sale-date">Date</Label>
                    <Input
                      type="date"
                      id="sale-date"
                      value={newSale.date}
                      onChange={(e) =>
                        setNewSale({
                          ...newSale,
                          date: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer</Label>
                    <div className="flex gap-2">
                      <Select
                        value={newSale.customer}
                        onValueChange={(value) =>
                          setNewSale({
                            ...newSale,
                            customer: value,
                          })
                        }
                        required
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer: any) => (
                            <SelectItem key={customer._id} value={customer._id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity of Eggs</Label>
                    <Input
                      type="number"
                      id="quantity"
                      placeholder="Enter quantity"
                      value={newSale.quantity}
                      onChange={(e) =>
                        setNewSale({
                          ...newSale,
                          quantity: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rate">Rate per 100 eggs</Label>
                    <Input
                      type="number"
                      id="rate"
                      placeholder="Enter rate per 100 eggs"
                      value={newSale.rate}
                      onChange={(e) =>
                        setNewSale({
                          ...newSale,
                          rate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex justify-between">
                      <span>Total Amount</span>
                      <span className="font-bold">
                        ₹{calculateTotalSale().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amountPaid">Amount Paid</Label>
                    <Input
                      type="number"
                      id="amountPaid"
                      placeholder={`Enter amount paid (default: ${calculateTotalSale().toFixed(
                        2
                      )})`}
                      value={newSale.amountPaid}
                      onChange={(e) =>
                        setNewSale({
                          ...newSale,
                          amountPaid: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNewSale();
                    }}
                  >
                    Record Sale
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
              </CardHeader>
              {isLoading && <Spinner />}
              {!isLoading && (
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Rate</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Payment</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sales.map((sale: any) => (
                        <TableRow key={sale._id}>
                          <TableCell>
                            {format(new Date(sale.date), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell>{sale.customer?.name}</TableCell>
                          <TableCell className="text-right">
                            {sale.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{sale.rate / 100}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{((sale.quantity * sale.rate) / 100).toFixed(2)}
                          </TableCell>
                          <TableCell
                            className={`text-right ${
                              getPaymentStatus(sale) !== "Exact"
                                ? parseFloat(getPaymentStatus(sale)) < 0
                                  ? "text-red-500"
                                  : "text-green-500"
                                : ""
                            }`}
                          >
                            ₹{sale.amountPaid.toFixed(2)} (
                            {getPaymentStatus(sale)})
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant={"ghost"}
                              onClick={() => handleDeleteSale(sale._id)}
                            >
                              <Trash2 size={16} color="red" />
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

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Add New Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Customer Name</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        id="customer-name"
                        placeholder="Enter customer name"
                        value={newCustomer.name}
                        onChange={(e) =>
                          setNewCustomer({
                            ...newCustomer,
                            name: e.target.value,
                          })
                        }
                        className="flex-1"
                        required
                      />
                      <Button onClick={handleNewCustomer}>Add</Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Customer Balances</CardTitle>
              </CardHeader>
              {isLoading && <Spinner />}
              {!isLoading && (
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer Name</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.map((customer: any) => (
                        <TableRow key={customer._id}>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell
                            className={`text-right ${
                              customer.balance < 0
                                ? "text-red-500"
                                : customer.balance > 0
                                ? "text-green-500"
                                : ""
                            }`}
                          >
                            ₹{customer.balance.toFixed(2)}
                            {customer.balance < 0
                              ? " (due)"
                              : customer.balance > 0
                              ? " (advance)"
                              : ""}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              )}
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Customer Sales History</CardTitle>
              </CardHeader>
              {isLoading && <Spinner />}
              {!isLoading && (
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="customer-filter">Filter by Customer</Label>
                    <Select
                      value={selectedCustomerFilter}
                      onValueChange={setSelectedCustomerFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Customers</SelectItem>
                        {customers.map((customer: any) => (
                          <SelectItem key={customer._id} value={customer._id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Table className="mt-4">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredSales().map((sale: any) => (
                        <TableRow key={sale._id}>
                          <TableCell>
                            {format(new Date(sale.date), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell>{sale.customer?.name}</TableCell>
                          <TableCell className="text-right">
                            {sale.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{((sale.quantity * sale.rate) / 100).toFixed(2)}
                          </TableCell>
                          <TableCell
                            className={`text-right ${
                              getPaymentStatus(sale) !== "Exact"
                                ? parseFloat(getPaymentStatus(sale)) < 0
                                  ? "text-red-500"
                                  : "text-green-500"
                                : ""
                            }`}
                          >
                            ₹{sale.amountPaid.toFixed(2)} (
                            {getPaymentStatus(sale)})
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
    </>
  );
}
