"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useNavigationHistory } from "@/hooks/use-navigation";
import { ChevronRight, Egg, PiggyBank, Skull } from "lucide-react";

export default function Reports() {
  // Register this page in navigation history
  useNavigationHistory();

  return (
    <main className="flex-1 container px-4 py-4 space-y-6">
      {/* Report Categories */}
      <div className="space-y-4">
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start h-auto py-4 px-4"
            asChild
          >
            <Link href="/reports/egg-production">
              <Egg className="w-5 h-5 mr-3 text-yellow-500" />
              <div className="flex-1 text-left">
                <div className="font-medium">Egg Production</div>
                <div className="text-sm text-muted-foreground">
                  Daily yields and trends
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-auto py-4 px-4"
            asChild
          >
            <Link href="/reports/mortality">
              <Skull className="w-5 h-5 mr-3 text-red-500" />
              <div className="flex-1 text-left">
                <div className="font-medium">Bird Mortality</div>
                <div className="text-sm text-muted-foreground">
                  Health and survival rates
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-auto py-4 px-4"
            asChild
          >
            <Link href="/reports/finances">
              <PiggyBank className="w-5 h-5 mr-3 text-green-500" />
              <div className="flex-1 text-left">
                <div className="font-medium">Financial Reports</div>
                <div className="text-sm text-muted-foreground">
                  Revenue and expenses
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
