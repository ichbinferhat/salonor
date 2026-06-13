export default function PanelLoading() {
  return (
    <div className="animate-pulse p-5 sm:p-8">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-xl bg-line" />
          <div className="h-4 w-64 rounded bg-line" />
        </div>
        <div className="h-11 w-32 rounded-full bg-line" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl border border-line bg-surface" />
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="h-80 rounded-2xl border border-line bg-surface" />
        <div className="h-80 rounded-2xl border border-line bg-surface" />
      </div>
    </div>
  );
}
