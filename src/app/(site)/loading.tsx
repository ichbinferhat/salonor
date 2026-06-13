export default function SiteLoading() {
  return (
    <div className="container-x animate-pulse py-10">
      <div className="mb-8 h-9 w-72 max-w-[80%] rounded-xl bg-line" />
      <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[5/4] rounded-[20px] bg-line" />
            <div className="h-4 w-3/4 rounded bg-line" />
            <div className="h-3 w-1/2 rounded bg-line" />
          </div>
        ))}
      </div>
    </div>
  );
}
