import { EmploymentType, employmentTypeLabels } from "@/lib/types/job";

const employmentTypes: EmploymentType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERN",
  "TEMPORARY",
  "REMOTE",
];

export function JobFilters({
  defaultValues,
}: {
  defaultValues: {
    keyword?: string;
    employmentType?: string;
    location?: string;
    minPay?: string;
    maxPay?: string;
    from?: string;
    to?: string;
  };
}) {
  return (
    <form className="flex flex-col gap-3" action="/jobs">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <input
          type="text"
          name="keyword"
          defaultValue={defaultValues.keyword}
          placeholder="Search job titles, skills, or companies"
          className="h-11 min-w-[220px] flex-1 rounded-md border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brass"
        />
        <input
          type="text"
          name="location"
          defaultValue={defaultValues.location}
          placeholder="Location"
          className="h-11 w-full rounded-md border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brass sm:w-48"
        />
        <select
          name="employmentType"
          defaultValue={defaultValues.employmentType ?? ""}
          className="h-11 w-full rounded-md border border-border bg-card px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass sm:w-48"
        >
          <option value="">Any type</option>
          {employmentTypes.map((type) => (
            <option key={type} value={type}>
              {employmentTypeLabels[type]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-11 shrink-0 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Search
        </button>
      </div>

      <details className="group">
        <summary className="w-fit cursor-pointer text-sm text-brass hover:underline">
          More filters
        </summary>
        <div className="mt-3 flex flex-col gap-3 rounded-md border border-border bg-card p-4 sm:flex-row sm:flex-wrap">
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Min pay
            <input
              type="number"
              name="minPay"
              defaultValue={defaultValues.minPay}
              min="0"
              placeholder="0"
              className="h-10 w-32 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Max pay
            <input
              type="number"
              name="maxPay"
              defaultValue={defaultValues.maxPay}
              min="0"
              placeholder="No limit"
              className="h-10 w-32 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Posted from
            <input
              type="date"
              name="from"
              defaultValue={defaultValues.from}
              className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Posted to
            <input
              type="date"
              name="to"
              defaultValue={defaultValues.to}
              className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass"
            />
          </label>
        </div>
      </details>
    </form>
  );
}