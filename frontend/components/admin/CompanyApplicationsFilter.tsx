const statuses = ["PENDING", "APPROVED", "REJECTED"];

export function CompanyApplicationsFilter({
  defaultValues,
}: {
  defaultValues: { keyword?: string; status?: string };
}) {
  return (
    <form action="/admin" className="flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        name="keyword"
        defaultValue={defaultValues.keyword}
        placeholder="Search by company or applicant"
        className="h-10 flex-1 rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brass"
      />
      <select
        name="status"
        defaultValue={defaultValues.status ?? ""}
        className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass sm:w-48"
      >
        <option value="">Any status</option>
        {statuses.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button
        type="submit"
        className="h-10 shrink-0 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Search
      </button>
    </form>
  );
}