"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { unsaveJob } from "@/lib/savedJobActions";
import { SavedJobResponse, employmentTypeLabels } from "@/lib/types/job";

function formatPay(job: SavedJobResponse) {
  if (!job.payMin && !job.payMax) return null;
  const period =
    job.payPeriod === "HOUR" ? "/hr" : job.payPeriod === "MONTH" ? "/mo" : job.payPeriod === "YEAR" ? "/yr" : "";
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  if (job.payMin && job.payMax) return `${fmt(job.payMin)}–${fmt(job.payMax)}${period}`;
  if (job.payMin) return `From ${fmt(job.payMin)}${period}`;
  return `Up to ${fmt(job.payMax!)}${period}`;
}

export function SavedJobCard({ job }: { job: SavedJobResponse }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleRemove() {
    setPending(true);
    const result = await unsaveJob(job.jobId);
    setPending(false);
    if (!result.error) router.refresh();
  }

  const pay = formatPay(job);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-4">
        <Link href={`/jobs?jobId=${job.jobId}`} className="hover:underline">
          <h2 className="font-heading text-base font-semibold text-foreground">{job.title}</h2>
        </Link>
        <span className="shrink-0 rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {employmentTypeLabels[job.employmentType]}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {job.companyName} · {job.location}
      </p>
      {pay && <p className="mt-2 font-mono text-sm text-verdigris">{pay}</p>}
      <button
        onClick={handleRemove}
        disabled={pending}
        className="mt-3 text-sm text-destructive hover:underline disabled:opacity-50"
      >
        {pending ? "Removing..." : "Remove"}
      </button>
    </div>
  );
}