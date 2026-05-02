import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { BarChart3, FileText, History, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { label: "Analyze", href: "/dashboard", icon: FileText },
  { label: "History", href: "/dashboard/history", icon: History },
  { label: "Profile", href: "/dashboard/profile", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-card/40 px-4 py-5 lg:block">
        <Link href="/" className="flex items-center gap-2 px-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BarChart3 className="size-4" aria-hidden="true" />
          </span>
          CVPilot AI
        </Link>
        <Separator className="my-5" />
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Button key={item.href} asChild variant="ghost" className="w-full justify-start">
              <Link href={item.href}>
                <item.icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/85 px-6 backdrop-blur">
          <div>
            <p className="text-sm font-medium">Dashboard</p>
            <p className="text-xs text-muted-foreground">Resume intelligence workspace</p>
          </div>
          <UserButton />
        </header>
        {children}
      </div>
    </div>
  );
}
