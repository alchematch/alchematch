export function JobsFilter({ defaultValues }: { defaultValues: { keyword?: string } }) {
  return (
    <form action="/company/jobs" className="flex gap-3">
      <input
        type="text"
        name="keyword"
        defaultValue={defaultValues.keyword}
        placeholder="Search your jobs"
        className="h-10 flex-1 rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brass"
      />
      <button
        type="submit"
        className="h-10 shrink-0 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Search
      </button>
    </form>
  );
}