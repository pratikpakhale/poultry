"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigationHistory } from "@/hooks/use-navigation";
import {
  BarChart,
  Bird,
  Egg,
  Package,
  Settings,
  Syringe,
  TreesIcon as Tree,
  Users,
  Wheat,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  // Register this page in navigation history
  useNavigationHistory();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">Pakhale Poultry</h1>
          <Link href="/manage">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-5 pb-16">
        {/* Quick Actions */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            QUICK ACTIONS
          </h2>
          <div className="grid grid-cols-4 gap-3">
            <Link href="/eggs/production/new">
              <Card className="p-3 flex flex-col items-center justify-center aspect-square hover:bg-muted/50 transition-colors">
                <Egg className="h-6 w-6 mb-1 text-blue-500" />
                <span className="text-xs text-center">Record Eggs</span>
              </Card>
            </Link>
            <Link href="/birds/mortality/new">
              <Card className="p-3 flex flex-col items-center justify-center aspect-square hover:bg-muted/50 transition-colors">
                <Bird className="h-6 w-6 mb-1 text-red-500" />
                <span className="text-xs text-center">Mortality</span>
              </Card>
            </Link>
            <Link href="/feed/production/new">
              <Card className="p-3 flex flex-col items-center justify-center aspect-square hover:bg-muted/50 transition-colors">
                <Wheat className="h-6 w-6 mb-1 text-amber-500" />
                <span className="text-xs text-center">Batch Production</span>
              </Card>
            </Link>
            <Link href="/reports">
              <Card className="p-3 flex flex-col items-center justify-center aspect-square hover:bg-muted/50 transition-colors">
                <BarChart className="h-6 w-6 mb-1 text-green-500" />
                <span className="text-xs text-center">Reports</span>
              </Card>
            </Link>
          </div>
        </section>

        {/* Main Categories */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            MAIN CATEGORIES
          </h2>

          <Card className="mb-4 overflow-hidden border-l-4 border-l-blue-500">
            <div className="flex">
              <Link href="/eggs" className="flex-1 flex items-center p-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mr-4">
                  <Egg className="h-6 w-6 text-blue-500" />
                </div>
                <span className="text-lg font-medium">Eggs</span>
              </Link>
              <div className="flex items-center gap-2 pr-3">
                <Link href="/eggs/production">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Production
                  </Button>
                </Link>
                <Link href="/eggs/sales">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Sales
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="mb-4 overflow-hidden border-l-4 border-l-amber-500">
            <div className="flex">
              <Link href="/feed" className="flex-1 flex items-center p-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mr-4">
                  <Wheat className="h-6 w-6 text-amber-500" />
                </div>
                <span className="text-lg font-medium">Feed</span>
              </Link>
              <div className="flex items-center gap-2 pr-3">
                <Link href="/feed/production">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Batch Production
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="mb-4 overflow-hidden border-l-4 border-l-red-500">
            <div className="flex">
              <Link href="/birds" className="flex-1 flex items-center p-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mr-4">
                  <Bird className="h-6 w-6 text-red-500" />
                </div>
                <span className="text-lg font-medium">Birds</span>
              </Link>
              <div className="flex items-center gap-2 pr-3">
                <Link href="/birds/mortality">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Mortality
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>

        {/* Other Categories */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            OTHER MANAGEMENT
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Link href="/vaccines">
              <Card className="p-3 flex flex-col items-center justify-center aspect-square hover:bg-muted/50 transition-colors">
                <Syringe className="h-6 w-6 mb-1 text-purple-500" />
                <span className="text-xs text-center">Vaccines</span>
              </Card>
            </Link>
            <Link href="/manure">
              <Card className="p-3 flex flex-col items-center justify-center aspect-square hover:bg-muted/50 transition-colors">
                <Tree className="h-6 w-6 mb-1 text-green-500" />
                <span className="text-xs text-center">Manure</span>
              </Card>
            </Link>
            <Link href="/other">
              <Card className="p-3 flex flex-col items-center justify-center aspect-square hover:bg-muted/50 transition-colors">
                <Package className="h-6 w-6 mb-1 text-gray-500" />
                <span className="text-xs text-center">Other</span>
              </Card>
            </Link>
            <Link href="/eggs/customers">
              <Card className="p-3 flex flex-col items-center justify-center aspect-square hover:bg-muted/50 transition-colors">
                <Users className="h-6 w-6 mb-1 text-blue-500" />
                <span className="text-xs text-center">Customers</span>
              </Card>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
