import Link from "next/link";
import { buildJobsQuery } from "@/lib/utils";

interface PaginationProps {
  basePath: string;
  searchParams: Record<string, string | undefined>;
  pageNumber: number;
  totalPages: number;
}

export function Pagination({ basePath, searchParams, pageNumber, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const hasPrevious = pageNumber > 0;
  const hasNext = pageNumber + 1 < totalPages;

  return (
    <div className="flex items-center justify-center gap-4">
      {hasPrevious ? (
        <Link
          href={`${basePath}?${buildJobsQuery(searchParams, { page: String(pageNumber - 1) })}`}
          className="text-sm text-brass hover:underline"
        >
          ← Previous
        </Link>
      ) : (
        <span className="text-sm text-muted-foreground/40">← Previous</span>
      )}
      <span className="text-sm text-muted-foreground">
        Page {pageNumber + 1} of {totalPages}
      </span>
      {hasNext ? (
        <Link
          href={`${basePath}?${buildJobsQuery(searchParams, { page: String(pageNumber + 1) })}`}
          className="text-sm text-brass hover:underline"
        >
          Next →
        </Link>
      ) : (
        <span className="text-sm text-muted-foreground/40">Next →</span>
      )}
    </div>
  );
}