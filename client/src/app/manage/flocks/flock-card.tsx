"use client";

import { useState } from "react";
import { Users, Pencil, Check, X, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DeleteFlock } from "./delete-flock";

interface Flock {
  id: string;
  name: string;
  active: boolean;
  birds: number;
}

interface FlockCardProps {
  flock: Flock;
  onUpdate: (id: string, data: any) => Promise<void>;
}

export default function FlockCard({ flock, onUpdate }: FlockCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const active = formData.get("active") === "on";

    await onUpdate(flock.id, { name, active });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await onUpdate(flock.id, { deleted: true });
    setIsEditing(false);
    setIsDeleting(false);
  };

  return (
    <Card className="p-4 max-w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <Users className="h-8 w-8 mr-3" />
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Input
                    name="name"
                    defaultValue={flock.name}
                    className="font-medium w-full"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    name="active"
                    defaultChecked={flock.active}
                    id="active-status"
                  />
                  <Label htmlFor="active-status">Active</Label>
                </div>
                <div className="border-b w-full" />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="default" type="submit">
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    type="button"
                    onClick={() => setIsDeleting(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{flock.name}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {flock.active ? "Active" : "Inactive"} • Planning •{" "}
                {flock.birds} birds
              </p>
            </div>
          )}
        </div>
      </div>
      <DeleteFlock
        open={isDeleting}
        onOpenChange={setIsDeleting}
        onDelete={handleDelete}
      />
    </Card>
  );
}
