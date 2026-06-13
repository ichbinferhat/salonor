import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="container-x py-8">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="mt-2 h-5 w-32" />
      <div className="mt-6 flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-full" />
        ))}
      </div>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_420px]">
        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[20px] border border-line bg-surface">
              <Skeleton className="aspect-[4/3] rounded-none" />
              <div className="space-y-2.5 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="hidden h-[calc(100dvh-7rem)] rounded-[24px] lg:block" />
      </div>
    </div>
  );
}
