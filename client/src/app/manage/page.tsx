import { BottomNav } from "@/components/bottom-nav";
import { Card } from "@/components/ui/card";
import { Users, ClipboardList, Package2 } from "lucide-react";
import Link from "next/link";

export default function Manage() {
  return (
    <>
      <header className="border-b">
        <h1 className="px-4 py-4 text-xl font-semibold">Manage</h1>
      </header>

      <div className="p-4 space-y-4 flex flex-col">
        <Link href="/manage/flocks">
          <Card className="p-4 flex items-center hover:bg-muted/50 transition-colors">
            <Users className="h-5 w-5 mr-3" />
            <div>
              <h2 className="font-medium">Flocks</h2>
              <p className="text-sm text-muted-foreground">
                Manage your flocks
              </p>
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
    </>
  );
}
