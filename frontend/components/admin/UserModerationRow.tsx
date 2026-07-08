"use client";

import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { DropdownCustom } from "@/components/ui/dropdown-custom";
import { Button } from "@/components/ui/button";
import { updateUserModeration } from "@/lib/adminUserActions";
import { AdminUserResponse } from "@/lib/types/adminUser";

export function UserModerationRow({ user }: { user: AdminUserResponse }) {
  const router = useRouter();

  async function toggleEnabled() {
    const result = await updateUserModeration(user.userId, { enabled: !user.enabled });
    if (!result.error) router.refresh();
  }

  async function toggleLocked() {
    const result = await updateUserModeration(user.userId, { accountNonLocked: !user.accountNonLocked });
    if (!result.error) router.refresh();
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
      <div>
        <h2 className="font-heading text-sm font-semibold text-foreground">{user.username}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{user.email}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{user.role}</p>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${
            user.enabled ? "border-verdigris text-verdigris" : "border-cinnabar text-cinnabar"
          }`}
        >
          {user.enabled ? "Enabled" : "Disabled"}
        </span>
        <span
          className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${
            user.accountNonLocked ? "border-border text-muted-foreground" : "border-cinnabar text-cinnabar"
          }`}
        >
          {user.accountNonLocked ? "Unlocked" : "Locked"}
        </span>
        <DropdownCustom
          trigger={
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          }
          items={[
            { label: user.enabled ? "Disable account" : "Enable account", onClick: toggleEnabled },
            {
              label: user.accountNonLocked ? "Lock account" : "Unlock account",
              onClick: toggleLocked,
              variant: "destructive",
            },
          ]}
          align="right"
        />
      </div>
    </div>
  );
}