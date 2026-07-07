"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { logout } from "@/lib/auth";
import { navLinks } from "@/lib/links";
import { Button } from "@/components/ui/button";
import { DropdownCustom } from "@/components/ui/dropdown-custom";
import { FlaskIcon } from "@/components/icons/FlaskIcon";

interface NavbarClientProps {
  user: { username: string; email: string; role?: string } | null;
}

function dashboardHref(role?: string) {
  if (role === "ROLE_COMPANY") return "/company";
  if (role === "ROLE_SUPER_ADMIN" || role === "ROLE_ADMIN") return "/admin";
  return "/profile";
}

export function NavbarClient({ user }: NavbarClientProps) {
  const router = useRouter();
  const href = dashboardHref(user?.role);

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  const mobileItems = [
    ...navLinks.map((link) => ({ label: link.label, href: link.href })),
    ...(user
      ? [
          { label: "Dashboard", href },
          { label: "Log out", onClick: handleLogout, variant: "destructive" as const },
        ]
      : [
          { label: "Log in", href: "/login" },
          { label: "Sign up", href: "/register" },
        ]),
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-6 py-3">
      <div className="hidden md:flex items-center gap-6">
        <Link href="/" className="font-heading font-semibold">
          Alche<span className="text-brass">Match</span>
        </Link>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            {link.icon === "flask" && <FlaskIcon className="h-4 w-4 text-brass" />}
            {link.label}
          </Link>
        ))}
      </div>

      <Link href="/" className="font-heading font-semibold md:hidden">
        Alche<span className="text-brass">Match</span>
      </Link>

      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <>
            <Link href={href} className="text-sm text-muted-foreground hover:text-foreground">
              {user.username}
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Button asChild variant="ghost">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign up</Link>
            </Button>
          </>
        )}
      </div>

      <div className="flex md:hidden">
        <DropdownCustom
          trigger={
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          }
          items={mobileItems}
          align="right"
        />
      </div>
    </nav>
  );
}