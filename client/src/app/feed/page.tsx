"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { Spinner } from "@/components/ui/spinner";
import { Trash2 } from "lucide-react";

export default function FeedManagement() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "inventory";
  const today = format(new Date(), "yyyy-MM-dd");

  const [isProductionsLoading, setIsProductionsLoading] = useState(false);
  const [isFormulasLoading, setIsFormulasLoading] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [deductMaterials, setDeductMaterials] = useState<any>([]);
  const [deductMaterial, setDeductMaterial] = useState<{
    date: Date;
    material: string;
    quantity: number | null;
    cost: number | null;
  }>({
    date: new Date(),
    material: "",
    quantity: null,
    cost: null,
  });

  const [purchaseMaterials, setPurchaseMaterials] = useState([]);
  const [purchaseMaterial, setPurchaseMaterial] = useState<{
    date: Date;
    material: string;
    quantity: number | null;
    cost: number | null;
  }>({
    date: new Date(),
    material: "",
    quantity: null,
    cost: null,
  });

  const [productions, setProductions] = useState([]);
  interface Formula {
    _id: string;
    name: string;
    materials: Array<{
      material: {
        _id: string;
        name: string;
        quantity: number;
        unit: string;
      };
      quantity: number;
    }>;
  }

  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [selectedFormula, setSelectedFormula] = useState<string | null>(null);

  const productionAcitvity = [...productions, ...deductMaterials].sort((a, b) =>
    new Date(a.date) > new Date(b.date) ? -1 : 1
  );

  const fetchProductions = useCallback(async () => {
    setIsProductionsLoading(true);
    const res = await getAll("feedProduction", {
      populate: "formula",
    });
    setProductions(res.data);
    setIsProductionsLoading(false);
  }, []);

  const fetchFormulas = useCallback(async () => {
    setIsFormulasLoading(true);
    const res = await getAll("formula", {
      populate: "materials.material",
    });
    setFormulas(res.data);
    setIsFormulasLoading(false);
  }, []);

  const fetchMaterials = useCallback(async () => {
    const res = await getAll("material");
    setMaterials(res.data);
  }, []);

  const fetchDeductMaterials = useCallback(async () => {
    const res = await getAll("feedSale", {
      populate: "material",
    });
    setDeductMaterials(res.data);
  }, []);

  const handleDeductMaterial = async () => {
    await create("feedSale", deductMaterial);
    fetchAll();
    setDeductMaterial({
      date: new Date(),
      material: "",
      quantity: 0,
      cost: 0,
    });
  };

  const handleDeleteDeductMaterial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    await remove("feedSale", id);
    fetchAll();
  };

  const handleNewProduction = async () => {
    await create("feedProduction", {
      date: new Date(),
      formula: selectedFormula,
    });
    fetchAll();
    setSelectedFormula(null);
  };

  const handleDeleteProduction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    await remove("feedProduction", id);
    fetchAll();
  };

  const fetchPurchases = useCallback(async () => {
    const res = await getAll("feedPurchase", {
      populate: "material",
    });
    setPurchaseMaterials(res.data);
  }, []);

  const handleNewPurchase = async () => {
    await create("feedPurchase", purchaseMaterial);
    fetchAll();
    setPurchaseMaterial({
      date: new Date(),
      material: "",
      quantity: 0,
      cost: 0,
    });
  };

  const handleDeletePurchase = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    await remove("feedPurchase", id);
    fetchAll();
  };

  const fetchAll = () => {
    fetchProductions();
    fetchFormulas();
    fetchMaterials();
    fetchDeductMaterials();
    fetchPurchases();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <>
      <header className="border-b">
        <h1 className="px-4 py-4 text-xl font-semibold">Feed Management</h1>
      </header>


      <div className="p-4">
        <Tabs defaultValue={defaultTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Raw Materials Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((material: any) => (
                      <TableRow key={material._id}>
                        <TableCell>{material.name}</TableCell>
                        <TableCell>{material.type}</TableCell>
                        <TableCell className="text-right">
                          {material.quantity} {material.unit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="production" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>New Batch Production</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" defaultValue={today} />
                  </div>

                  <div className="space-y-2">
                    <Label>Select Formula</Label>
                    <Select
                      required
                      value={selectedFormula || ""}
                      onValueChange={(e) => setSelectedFormula(e)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a formula" />
                      </SelectTrigger>
                      {isFormulasLoading && <Spinner />}
                      {!isFormulasLoading && (
                        <SelectContent>
                          {formulas.map((formula: any) => (
                            <SelectItem key={formula._id} value={formula._id}>
                              {formula.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      )}
                    </Select>
                  </div>

                  {selectedFormula && (
                    <Card className="bg-muted">
                      <CardHeader>
                        <CardTitle className="text-sm">
                          Formula Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Material</TableHead>
                              <TableHead className="text-right">
                                Required
                              </TableHead>
                              <TableHead className="text-right">
                                Available
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {formulas
                              .find((f) => f._id === selectedFormula)
                              ?.materials.map((m) => (
                                <TableRow key={m.material._id}>
                                  <TableCell>{m.material.name}</TableCell>
                                  <TableCell className="text-right">
                                    {m.quantity} {m.material.unit}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {m.material.quantity} {m.material.unit}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}

                  <Button
                    className="w-full"
                    type="button"
                    onClick={handleNewProduction}
                  >
                    Produce Batch
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Raw Material Sale</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={format(deductMaterial.date, "yyyy-MM-dd")}
                      onChange={(e: any) =>
                        setDeductMaterial({
                          ...deductMaterial,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Material</Label>
                    <Select
                      value={deductMaterial.material}
                      onValueChange={(e: any) =>
                        setDeductMaterial({
                          ...deductMaterial,
                          material: e,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent>
                        {materials.map((material: any) => (
                          <SelectItem key={material._id} value={material._id}>
                            {material.name} ({material.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="Enter quantity"
                      value={deductMaterial.quantity || ""}
                      onChange={(e: any) =>
                        setDeductMaterial({
                          ...deductMaterial,
                          quantity: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Cost</Label>
                    <Input
                      type="number"
                      placeholder="Enter cost"
                      value={deductMaterial.cost || ""}
                      onChange={(e: any) =>
                        setDeductMaterial({
                          ...deductMaterial,
                          cost: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleDeductMaterial}
                  >
                    Record Material
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Production History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  {/* {isProductionsLoading && <Spinner />} */}
                  <TableBody>
                    {!isProductionsLoading &&
                      productionAcitvity.map((activity: any) => (
                        <TableRow key={activity._id}>
                          <TableCell>
                            {format(activity.date, "MMM dd")}
                          </TableCell>
                          <TableCell>
                            {activity.formula
                              ? activity.formula.name
                              : activity.material?.name +
                                ` (${activity.quantity} ${activity.material?.unit})`}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                activity.formula
                                  ? handleDeleteProduction(activity._id)
                                  : handleDeleteDeductMaterial(activity._id);
                              }}
                            >
                              <Trash2 color="red" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Record Purchase</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={format(purchaseMaterial.date, "yyyy-MM-dd")}
                      onChange={(e: any) =>
                        setPurchaseMaterial({
                          ...purchaseMaterial,
                          date: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Material</Label>
                    <Select
                      value={purchaseMaterial.material}
                      onValueChange={(e: any) =>
                        setPurchaseMaterial({
                          ...purchaseMaterial,
                          material: e,
                        })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent>
                        {materials.map((material: any) => (
                          <SelectItem key={material._id} value={material._id}>
                            {material.name} ({material.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      value={purchaseMaterial.quantity || ""}
                      onChange={(e: any) =>
                        setPurchaseMaterial({
                          ...purchaseMaterial,
                          quantity: e.target.value,
                        })
                      }
                      type="number"
                      placeholder="Enter weight"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Cost (₹)</Label>
                    <Input
                      value={purchaseMaterial.cost || ""}
                      onChange={(e: any) =>
                        setPurchaseMaterial({
                          ...purchaseMaterial,
                          cost: e.target.value,
                        })
                      }
                      type="number"
                      placeholder="Enter cost"
                      required
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleNewPurchase}
                    className="w-full"
                  >
                    Record Purchase
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Purchase History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead className="text-right">Weight</TableHead>
                      <TableHead className="text-right">Cost (₹)</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseMaterials.map((purchase: any) => (
                      <TableRow key={purchase._id}>
                        <TableCell>
                          {format(new Date(purchase.date), "MMM dd")}
                        </TableCell>
                        <TableCell>{purchase.material.name}</TableCell>
                        <TableCell className="text-right">
                          {purchase.quantity} {purchase.material.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {purchase.cost}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
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
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
