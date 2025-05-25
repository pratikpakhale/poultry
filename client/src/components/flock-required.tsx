"use client";

import { useFlocks } from "@/store/flocks";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus } from "lucide-react";

type FlockRequiredProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

export function FlockRequired({
  children,
  title = "Select a Flock",
  description = "Please select a flock to continue or create a new one if you haven't set up any flocks yet.",
}: FlockRequiredProps) {
  const { selectedFlock, flocks, isLoading } = useFlocks();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-10 w-48 bg-muted rounded"></div>
          <div className="h-4 w-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!selectedFlock) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {flocks.length > 0
              ? "You need to select a flock to access this page."
              : "You don't have any flocks yet. Create your first flock to get started."}
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={() =>
              router.push(
                flocks.length > 0 ? "/select-flock" : "/manage/flocks"
              )
            }
            className="flex items-center gap-2"
          >
            {flocks.length > 0 ? (
              <>
                Select Flock <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                Create Flock <Plus className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return <>{children}</>;
}
