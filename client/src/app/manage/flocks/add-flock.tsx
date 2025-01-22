import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function AddFlock({
  open,
  onSubmit,
  onOpenChange,
}: {
  open: boolean;
  onSubmit: (flock: { name: string }) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [flock, setFlock] = useState({
    name: "",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Flock</DialogTitle>
          <DialogDescription>
            Create a new flock to start managing your birds
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              type="text"
              onChange={(e) => setFlock({ ...flock, name: e.target.value })}
              name="name"
              id="name"
              value={flock.name}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              onSubmit(flock);
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
