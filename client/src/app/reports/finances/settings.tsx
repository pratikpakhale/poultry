"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export interface FarmSettingsState {
  flocks: string[];
  expenses: {
    birdPurchase: boolean;
    feedPurchase: boolean;
    vaccine: boolean;
    other: boolean;
  };
  income: {
    birdSale: boolean;
    eggsSale: boolean;
    feedSale: boolean;
    manure: boolean;
  };
}

export interface FarmSettingsProps {
  settings: FarmSettingsState;
  onSettingsChange: (newSettings: FarmSettingsState) => void;
  flocks: { name: string; _id: string }[];
}

export default function FarmSettings({
  settings,
  onSettingsChange,
  flocks,
}: FarmSettingsProps) {
  const updateSettings = (
    section: keyof FarmSettingsState,
    key: string,
    value: boolean
  ) => {
    const newSettings = { ...settings };
    if (section === "flocks") {
      if (value) {
        newSettings.flocks = [...settings.flocks, key];
      } else {
        newSettings.flocks = settings.flocks.filter((id) => id !== key);
      }
    } else {
      (newSettings[section] as Record<string, unknown>)[key] = value;
    }
    onSettingsChange(newSettings);
  };

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-2xl">
      {/* Flocks Section */}
      <Card>
        <CardHeader>
          <CardTitle>Flocks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {flocks.map(
            (flock: { name: string; _id: string; selected?: boolean }) => (
              <div
                key={flock._id}
                className="flex items-center justify-between"
              >
                <Label htmlFor={`flock-${flock._id}`} className="flex flex-col">
                  <span className="text-base">{flock.name}</span>
                </Label>
                <Switch
                  id={`flock-${flock._id}`}
                  checked={flock.selected}
                  onCheckedChange={(checked) =>
                    updateSettings("flocks", flock._id, checked)
                  }
                />
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Expenses Section */}
      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="birdPurchase">Bird Purchase</Label>
            <Switch
              id="birdPurchase"
              checked={settings.expenses.birdPurchase}
              onCheckedChange={(checked) =>
                updateSettings("expenses", "birdPurchase", checked)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="feedPurchase">Feed Purchase</Label>
            <Switch
              id="feedPurchase"
              checked={settings.expenses.feedPurchase}
              onCheckedChange={(checked) =>
                updateSettings("expenses", "feedPurchase", checked)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="vaccine">Vaccine</Label>
            <Switch
              id="vaccine"
              checked={settings.expenses.vaccine}
              onCheckedChange={(checked) =>
                updateSettings("expenses", "vaccine", checked)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="otherExpenses">Other</Label>
            <Switch
              id="otherExpenses"
              checked={settings.expenses.other}
              onCheckedChange={(checked) =>
                updateSettings("expenses", "other", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Income Section */}
      <Card>
        <CardHeader>
          <CardTitle>Income</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="birdSale">Bird Sale</Label>
            <Switch
              id="birdSale"
              checked={settings.income.birdSale}
              onCheckedChange={(checked) =>
                updateSettings("income", "birdSale", checked)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="eggsSale">Eggs Sale</Label>
            <Switch
              id="eggsSale"
              checked={settings.income.eggsSale}
              onCheckedChange={(checked) =>
                updateSettings("income", "eggsSale", checked)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="feedSale">Feed Sale</Label>
            <Switch
              id="feedSale"
              checked={settings.income.feedSale}
              onCheckedChange={(checked) =>
                updateSettings("income", "feedSale", checked)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="manure">Manure</Label>
            <Switch
              id="manure"
              checked={settings.income.manure}
              onCheckedChange={(checked) =>
                updateSettings("income", "manure", checked)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
