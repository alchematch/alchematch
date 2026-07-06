import Link from "next/link";
import { JobResponse, employmentTypeLabels } from "@/lib/types/job";
import { cn } from "@/lib/utils";

function formatPay(job: JobResponse) {
  if (!job.payMin && !job.payMax) return null;
  const period =
    job.payPeriod === "HOUR" ? "/hr" : job.payPeriod === "MONTH" ? "/mo" : job.payPeriod === "YEAR" ? "/yr" : "";
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  if (job.payMin && job.payMax) return `${fmt(job.payMin)}–${fmt(job.payMax)}${period}`;
  if (job.payMin) return `From ${fmt(job.payMin)}${period}`;
  return `Up to ${fmt(job.payMax!)}${period}`;
}

export function JobCard({
  job,
  href,
  active,
}: {
  job: JobResponse;
  href: string;
  active: boolean;
}) {
  const pay = formatPay(job);

  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        "block rounded-lg border p-4 transition-colors",
        active ? "border-brass bg-card" : "border-border bg-card hover:border-brass/50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-base font-semibold text-foreground">
            {job.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {job.companyName} · {job.location}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {employmentTypeLabels[job.employmentType]}
        </span>
      </div>
      {pay && <p className="mt-2 font-mono text-sm text-verdigris">{pay}</p>}
    </Link>
  );
}