import { EmploymentType, employmentTypeLabels } from "@/lib/types/job";

const employmentTypes: EmploymentType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERN",
  "TEMPORARY",
  "REMOTE",
];

export function JobFiltersSidebar({
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
    <form className="flex flex-col gap-4" action="/jobs">
      <h2 className="font-heading text-sm font-semibold text-foreground">Filters</h2>

      <label className="flex flex-col gap-1 text-xs text-muted-foreground">
        Keyword
        <input
          type="text"
          name="keyword"
          defaultValue={defaultValues.keyword}
          placeholder="Titles, skills, companies"
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brass"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs text-muted-foreground">
        Location
        <input
          type="text"
          name="location"
          defaultValue={defaultValues.location}
          placeholder="City, remote..."
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brass"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs text-muted-foreground">
        Employment type
        <select
          name="employmentType"
          defaultValue={defaultValues.employmentType ?? ""}
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass"
        >
          <option value="">Any type</option>
          {employmentTypes.map((type) => (
            <option key={type} value={type}>
              {employmentTypeLabels[type]}
            </option>
          ))}
        </select>
      </label>

      <div className="flex gap-2">
        <label className="flex flex-1 flex-col gap-1 text-xs text-muted-foreground">
          Min pay
          <input
            type="number"
            name="minPay"
            defaultValue={defaultValues.minPay}
            min="0"
            placeholder="0"
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-xs text-muted-foreground">
          Max pay
          <input
            type="number"
            name="maxPay"
            defaultValue={defaultValues.maxPay}
            min="0"
            placeholder="No limit"
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs text-muted-foreground">
        Posted from
        <input
          type="date"
          name="from"
          defaultValue={defaultValues.from}
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs text-muted-foreground">
        Posted to
        <input
          type="date"
          name="to"
          defaultValue={defaultValues.to}
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass"
        />
      </label>

      <button
        type="submit"
        className="h-10 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Apply filters
      </button>
    </form>
  );
}