"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { create } from "@/lib/api";
import { FlockRequired } from "@/components/flock-required";

export default function NewCustomerPage() {
  const router = useRouter();
  const [newCustomer, setNewCustomer] = useState({
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!newCustomer.name.trim()) {
      alert("Please enter a customer name");
      return;
    }

    const response = await create("customer", newCustomer);

    if (response) {
      // Go back to the customers list
      if (router.back) {
        router.back();
      } else {
        router.push("/eggs/customers");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <FlockRequired>
        {/* Header without back button */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Add New Customer</h1>
        </div>

        {/* Form Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="customer-name">Customer Name</Label>
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
                  autoFocus
                  required
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full">
                  Add Customer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </FlockRequired>
    </div>
  );
}
