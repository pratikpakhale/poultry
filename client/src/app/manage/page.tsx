"use client";

import { Card } from "@/components/ui/card";
import { Users, ClipboardList, Package2 } from "lucide-react";
import Link from "next/link";
import { useNavigationHistory } from "@/hooks/use-navigation";

export default function Manage() {
  // Register this page in navigation history
  useNavigationHistory();

  return (
    <div className="p-4 space-y-4 flex flex-col">
      <Link href="/manage/flocks">
        <Card className="p-4 flex items-center hover:bg-muted/50 transition-colors">
          <Users className="h-5 w-5 mr-3" />
          <div>
            <h2 className="font-medium">Flocks</h2>
            <p className="text-sm text-muted-foreground">Manage your flocks</p>
          </div>
        </Card>
      </Link>

      <Link href="/manage/feed-formulas">
        <Card className="p-4 flex items-center hover:bg-muted/50 transition-colors">
          <ClipboardList className="h-5 w-5 mr-3" />
          <div>
            <h2 className="font-medium">Feed Formulas</h2>
            <p className="text-sm text-muted-foreground">
              Configure feed production recipes
            </p>
          </div>
        </Card>
      </Link>

      <Link href="/manage/materials">
        <Card className="p-4 flex items-center hover:bg-muted/50 transition-colors">
          <Package2 className="h-5 w-5 mr-3" />
          <div>
            <h2 className="font-medium">Raw Materials</h2>
            <p className="text-sm text-muted-foreground">
              Manage material types
            </p>
          </div>
        </Card>
      </Link>
    </div>
  );
}
