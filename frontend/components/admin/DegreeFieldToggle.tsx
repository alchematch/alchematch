"use client";

import { useRouter } from "next/navigation";
import { toggleDegreeFieldActive } from "@/lib/degreeFieldActions";

export function DegreeFieldToggle({ id, active }: { id: number; active: boolean }) {
  const router = useRouter();

  async function handleToggle() {
    const result = await toggleDegreeFieldActive(id, !active);
    if (!result.error) router.refresh();
  }

  return (
    <button
      onClick={handleToggle}
      className={`rounded-full border px-3 py-1 text-xs font-medium ${
        active
          ? "border-verdigris text-verdigris"
          : "border-muted-foreground text-muted-foreground"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </button>
  );
}