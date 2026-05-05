import Link from "next/link";
import Image from "next/image";
import { Filter, Search, Users as UsersIcon } from "lucide-react";

import { getAdminUsers } from "@/src/services/admin.service";
import UserRowActions from "@/components/modules/admin/UserRowActions";

export const metadata = { title: "Users · Nexora Admin" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  search?: string;
  role?: string;
  status?: string;
  page?: string;
}>;

const ROLE_OPTIONS = [
  { value: "", label: "All roles" },
  { value: "ADMIN", label: "Admin" },
  { value: "STAFF", label: "Staff" },
  { value: "SELLER", label: "Seller" },
  { value: "CUSTOMER", label: "Customer" },
];
const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "BLOCKED", label: "Blocked" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "DELETED", label: "Deleted" },
];

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);

  const res = await getAdminUsers({
    search: sp.search || undefined,
    role: sp.role || undefined,
    status: (sp.status as never) || undefined,
    page,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const users = res.data;
  const meta = res.meta;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Users & members
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Search, edit, suspend, block, or restore any account.
        </p>
      </header>

      <form method="get" className="nx-card flex flex-wrap items-end gap-3 p-4">
        <label className="flex-1 min-w-50">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Search
          </span>
          <div className="mt-1.5 flex h-10 items-center gap-2 rounded-full border border-border bg-background px-3">
            <Search className="h-4 w-4 text-foreground/50" />
            <input
              name="search"
              defaultValue={sp.search ?? ""}
              placeholder="Email, name…"
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
        </label>
        <label className="min-w-40">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Role
          </span>
          <select
            name="role"
            defaultValue={sp.role ?? ""}
            className="mt-1.5 h-10 w-full rounded-full border border-border bg-background px-4 text-sm focus:outline-none"
          >
            {ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-40">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Status
          </span>
          <select
            name="status"
            defaultValue={sp.status ?? ""}
            className="mt-1.5 h-10 w-full rounded-full border border-border bg-background px-4 text-sm focus:outline-none"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-foreground px-4 text-xs font-semibold text-background hover:bg-foreground/90"
        >
          <Filter className="h-3.5 w-3.5" />
          Apply
        </button>
      </form>

      <div className="nx-card overflow-hidden">
        {users.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <UsersIcon className="mx-auto h-10 w-10 text-foreground/30" />
            <p className="mt-4 text-sm font-semibold">No users yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Users will appear here once they sign up.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/30 text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Orders</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-border last:border-b-0 hover:bg-secondary/20"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-secondary">
                          {u.image ? (
                            <Image
                              src={u.image}
                              alt=""
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="absolute inset-0 grid place-items-center text-xs font-semibold text-foreground/60">
                              {(u.name ?? u.email).slice(0, 1).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {u.name ?? "—"}
                          </p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground/80">{u.role}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={u.status} />
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {u._count?.orders ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <UserRowActions
                          user={{
                            id: u.id,
                            name: u.name ?? null,
                            role: u.role,
                            status: u.status,
                            isDeleted: u.isDeleted,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta && meta.totalPages > 1 && <Pagination meta={meta} sp={sp} />}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "ACTIVE"
      ? "bg-emerald-500/15 text-emerald-600"
      : status === "BLOCKED"
        ? "bg-rose-500/15 text-rose-600"
        : status === "SUSPENDED"
          ? "bg-amber-500/15 text-amber-700"
          : "bg-foreground/10 text-foreground/70";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tone}`}
    >
      {status.toLowerCase()}
    </span>
  );
}

function Pagination({
  meta,
  sp,
}: {
  meta: { page: number; totalPages: number };
  sp: Awaited<SearchParams>;
}) {
  const buildHref = (p: number) => {
    const q = new URLSearchParams();
    if (sp.search) q.set("search", sp.search);
    if (sp.role) q.set("role", sp.role);
    if (sp.status) q.set("status", sp.status);
    q.set("page", String(p));
    return `?${q.toString()}`;
  };
  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
      <span>
        Page {meta.page} of {meta.totalPages}
      </span>
      <div className="flex items-center gap-1.5">
        {meta.page > 1 && (
          <Link
            href={buildHref(meta.page - 1)}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground/80 hover:bg-secondary"
          >
            Previous
          </Link>
        )}
        {meta.page < meta.totalPages && (
          <Link
            href={buildHref(meta.page + 1)}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground/80 hover:bg-secondary"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
