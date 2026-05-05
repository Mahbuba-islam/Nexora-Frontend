import Image from "next/image";
import { Mail, Search, Shield, UserCircle, Users } from "lucide-react";

import { getAdminUsers } from "@/src/services/admin.service";
import RowActionButton from "@/components/modules/admin/RowActionButton";
import InlineEditDialog from "@/components/modules/admin/InlineEditDialog";
import {
  blockUserAction,
  deleteUserAction,
  reactivateUserAction,
  restoreUserAction,
  suspendUserAction,
  updateUserAction,
} from "../_actions";

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
  { value: "", label: "Any status" },
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

  const counts = {
    admins: users.filter((u) => u.role === "ADMIN").length,
    sellers: users.filter((u) => u.role === "SELLER").length,
    customers: users.filter((u) => u.role === "CUSTOMER").length,
    blocked: users.filter(
      (u) => u.status === "BLOCKED" || u.status === "SUSPENDED",
    ).length,
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Users
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Audit, suspend, or reactivate every account on Nexora.
          </p>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="On page" value={users.length} icon={Users} />
        <Stat label="Admins" value={counts.admins} accent="violet" icon={Shield} />
        <Stat label="Sellers" value={counts.sellers} accent="emerald" />
        <Stat label="Restricted" value={counts.blocked} accent="rose" />
      </div>

      <form
        method="get"
        className="nx-card flex flex-wrap items-end gap-3 p-4"
      >
        <label className="flex-1 min-w-50">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Search
          </span>
          <div className="mt-1.5 flex h-10 items-center gap-2 rounded-full border border-border bg-background px-3">
            <Search className="h-4 w-4 text-foreground/50" />
            <input
              name="search"
              defaultValue={sp.search ?? ""}
              placeholder="Name or email"
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
        </label>
        <label className="min-w-35">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Role
          </span>
          <select
            name="role"
            defaultValue={sp.role ?? ""}
            className="mt-1.5 h-10 w-full rounded-full border border-border bg-background px-4 text-sm focus:outline-none"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
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
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-foreground px-4 text-xs font-semibold text-background hover:bg-foreground/90"
        >
          Apply
        </button>
      </form>

      <div className="nx-card overflow-hidden">
        {users.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Users className="mx-auto h-10 w-10 text-foreground/30" />
            <p className="mt-4 text-sm font-semibold">No users match.</p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/30 text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">User</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Orders</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Actions
                    </th>
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
                              <UserCircle className="absolute inset-0 m-auto h-6 w-6 text-foreground/40" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                              {u.name ?? "Unnamed"}
                            </p>
                            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <RolePill role={u.role} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={u.status} />
                      </td>
                      <td className="px-4 py-3 text-foreground/80">
                        {u._count?.orders ?? 0}
                      </td>
                      <td className="px-4 py-3 text-foreground/80">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          <UserActions user={u} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <ul className="divide-y divide-border md:hidden">
              {users.map((u) => (
                <li key={u.id} className="space-y-3 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-secondary">
                      {u.image ? (
                        <Image
                          src={u.image}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <UserCircle className="absolute inset-0 m-auto h-6 w-6 text-foreground/40" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {u.name ?? "Unnamed"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {u.email}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <RolePill role={u.role} />
                        <StatusPill status={u.status} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <UserActions user={u} />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

function UserActions({
  user,
}: {
  user: { id: string; name?: string | null; status: string; role: string; isDeleted?: boolean };
}) {
  return (
    <>
      <InlineEditDialog
        title={`Edit ${user.name ?? "user"}`}
        triggerLabel="Edit"
        fields={[
          { name: "name", label: "Display name", defaultValue: user.name ?? "" },
          {
            name: "role",
            label: "Role",
            type: "select",
            defaultValue: user.role,
            options: ROLE_OPTIONS.filter((r) => r.value !== ""),
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            defaultValue: user.status,
            options: STATUS_OPTIONS.filter((s) => s.value !== ""),
          },
        ]}
        onSave={(payload) => updateUserAction(user.id, payload)}
      />
      {user.status === "ACTIVE" && (
        <>
          <RowActionButton
            variant="subtle"
            label="Suspend"
            confirm={`Suspend ${user.name ?? "this user"}?`}
            action={() => suspendUserAction(user.id, "Suspended via admin UI")}
          />
          <RowActionButton
            variant="danger"
            label="Block"
            confirm={`Block ${user.name ?? "this user"}? They will be signed out everywhere.`}
            action={() => blockUserAction(user.id, "Blocked via admin UI")}
          />
        </>
      )}
      {(user.status === "BLOCKED" || user.status === "SUSPENDED") && (
        <RowActionButton
          variant="primary"
          label="Reactivate"
          action={() => reactivateUserAction(user.id)}
        />
      )}
      {user.isDeleted ? (
        <RowActionButton
          variant="primary"
          label="Restore"
          action={() => restoreUserAction(user.id)}
        />
      ) : (
        <RowActionButton
          variant="ghost"
          label="Delete"
          confirm={`Soft-delete ${user.name ?? "this user"}? You can restore them later.`}
          action={() => deleteUserAction(user.id)}
        />
      )}
    </>
  );
}

function Stat({
  label,
  value,
  accent,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  accent?: "emerald" | "rose" | "violet";
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const tone =
    accent === "emerald"
      ? "text-emerald-600"
      : accent === "rose"
        ? "text-rose-600"
        : accent === "violet"
          ? "text-[#4E8D9C]"
          : "text-foreground";
  return (
    <div className="nx-card flex items-center justify-between p-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <p className={`mt-1 text-2xl font-semibold tracking-tight ${tone}`}>
          {value}
        </p>
      </div>
      {Icon && <Icon className="h-5 w-5 text-foreground/40" />}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "ACTIVE"
      ? "bg-emerald-500/15 text-emerald-600"
      : status === "SUSPENDED"
        ? "bg-amber-500/15 text-amber-700"
        : status === "BLOCKED"
          ? "bg-rose-500/15 text-rose-600"
          : "bg-foreground/10 text-foreground/70";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tone}`}
    >
      {status.toLowerCase()}
    </span>
  );
}

function RolePill({ role }: { role: string }) {
  const tone =
    role === "ADMIN"
      ? "bg-[#281C59] text-white"
      : role === "SELLER"
        ? "bg-[#4E8D9C]/15 text-[#4E8D9C]"
        : role === "STAFF"
          ? "bg-violet-500/15 text-violet-600"
          : "bg-secondary text-foreground/80";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tone}`}
    >
      {role.toLowerCase()}
    </span>
  );
}
