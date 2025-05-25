"use client";

import { Card } from "@/components/ui/card";
import { FlockSelector } from "@/components/flock-selector";
import { useFlocks } from "@/store/flocks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, ArrowLeft } from "lucide-react";

export default function SelectFlockPage() {
  const { selectedFlock, flocks, isLoading } = useFlocks();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirecting, setRedirecting] = useState(false);

  // Get and decode the returnTo parameter
  const returnToParam = searchParams.get("returnTo");
  const returnTo = returnToParam ? decodeURIComponent(returnToParam) : "/";

  // Redirect to returnTo path if flock is selected
  useEffect(() => {
    if (!isLoading && selectedFlock && !redirecting) {
      setRedirecting(true);

      // Add a small delay to avoid potential race conditions
      const timeout = setTimeout(() => {
        console.log(`Redirecting to ${returnTo} after flock selection`);
        router.push(returnTo);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [selectedFlock, isLoading, router, returnTo, redirecting]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-muted-foreground">Loading flocks...</p>
      </div>
    );
  }

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 mt-4">
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <button
            onClick={handleGoBack}
            className="p-2 rounded-full hover:bg-muted mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-xl font-semibold">Select a Flock</h1>
        </div>

        {flocks.length === 0 ? (
          <div className="text-center p-4 space-y-4">
            <p className="mb-4">You don't have any active flocks yet.</p>
            <Link href="/manage/flocks">
              <Button>
                Create your first flock
                <Plus className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-4">
              Please select a flock to continue using the application.
            </p>
            <FlockSelector />

            <div className="mt-6 flex justify-between items-center pt-4 border-t">
              <Link href="/manage/flocks">
                <Button variant="outline" size="sm">
                  Manage Flocks
                </Button>
              </Link>

              <Button
                disabled={!selectedFlock}
                onClick={() => router.push(returnTo)}
                size="sm"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
