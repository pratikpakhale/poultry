'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, LineChart, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background z-50">
      <div className="flex h-16 items-center justify-around">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full",
            pathname === "/" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          href="/reports"
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full",
            pathname.startsWith("/reports")
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <LineChart className="h-5 w-5" />
          <span className="text-xs mt-1">Reports</span>
        </Link>
        <Link
          href="/manage"
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full",
            pathname.startsWith("/manage")
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs mt-1">Manage</span>
        </Link>
      </div>
    </nav>
  );
}

