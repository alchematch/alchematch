const roles = ["ROLE_USER", "ROLE_COMPANY", "ROLE_SUPER_ADMIN", "ROLE_ADMIN"];

export function UsersFilter({ defaultValues }: { defaultValues: { keyword?: string; role?: string } }) {
  return (
    <form action="/admin/moderation" className="flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        name="keyword"
        defaultValue={defaultValues.keyword}
        placeholder="Search by username or email"
        className="h-10 flex-1 rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brass"
      />
      <select
        name="role"
        defaultValue={defaultValues.role ?? ""}
        className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass sm:w-48"
      >
        <option value="">Any role</option>
        {roles.map((r) => (
          <option key={r} value={r}>{r}</option>
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