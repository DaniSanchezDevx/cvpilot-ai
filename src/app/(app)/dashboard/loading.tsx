import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6 xl:grid-cols-[1fr_380px]">
      <section className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-96" />
      </section>
      <aside className="space-y-6">
        <Skeleton className="h-80" />
        <Skeleton className="h-56" />
      </aside>
    </main>
  );
}

