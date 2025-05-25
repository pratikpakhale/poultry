"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigationHistory } from "@/hooks/use-navigation";
import {
  Bird,
  Egg,
  Package,
  Syringe,
  TreesIcon as Tree,
  Wheat,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  // Register this page in navigation history
  useNavigationHistory();

  return (
    <>
      <header className="border-b">
        <h1 className="px-4 py-4 text-xl font-semibold">
          Pakhale Poultry Management
        </h1>
      </header>

      <div className="p-4 space-y-4">
        <Card className="p-4">
          <div className="flex">
            <Link href="/eggs" className="flex-1 flex items-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-muted mr-4">
                <Egg className="h-8 w-8" />
              </div>
              <span className="text-lg font-medium">Eggs</span>
            </Link>
            <div className="flex flex-col gap-2 ml-4">
              <Link href="/eggs/production">
                <Button variant="outline" size="sm" className="w-24">
                  Production
                </Button>
              </Link>
              <Link href="/eggs/sales">
                <Button variant="outline" size="sm" className="w-24">
                  Sales
                </Button>
              </Link>
              <Link href="/eggs/customers">
                <Button variant="outline" size="sm" className="w-24">
                  Customers
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex">
            <Link href="/feed" className="flex-1 flex items-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-muted mr-4">
                <Wheat className="h-8 w-8" />
              </div>
              <span className="text-lg font-medium">Feed</span>
            </Link>
            <div className="flex flex-col gap-2 ml-4">
              <Link href="/feed/inventory">
                <Button variant="outline" size="sm" className="w-24">
                  Inventory
                </Button>
              </Link>
              <Link href="/feed/expenses">
                <Button variant="outline" size="sm" className="w-24">
                  Expenses
                </Button>
              </Link>
              <Link href="/feed/production">
                <Button variant="outline" size="sm" className="w-24">
                  Production
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 flex flex-col aspect-square">
            <Link
              href="/birds"
              className="flex-1 flex flex-col items-center justify-center"
            >
              <Bird className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Birds</span>
            </Link>
            <div className="grid grid-cols-1 gap-2 mt-4 pt-4 border-t">
              <Link href="/birds/mortality">
                <Button variant="outline" size="sm" className="w-full">
                  Mortality
                </Button>
              </Link>
            </div>
          </Card>

          <Link href="/vaccines">
            <Card className="p-4 flex flex-col items-center justify-center aspect-square hover:bg-muted/50 transition-colors">
              <Syringe className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Vaccines</span>
            </Card>
          </Link>

          <Link href="/manure">
            <Card className="p-4 flex flex-col items-center justify-center aspect-square hover:bg-muted/50 transition-colors">
              <Tree className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Manure</span>
            </Card>
          </Link>

          <Link href="/other">
            <Card className="p-4 flex flex-col items-center justify-center aspect-square hover:bg-muted/50 transition-colors">
              <Package className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Other</span>
            </Card>
          </Link>
        </div>
      </div>
    </>
  );
}
