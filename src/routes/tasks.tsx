import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { TASKS, TEAMS, type Status, type Task } from "@/lib/data";
import { useWorkspace } from "@/lib/workspace";
import { ArtistTag, PageHeader, Panel, Pill, Segmented } from "@/components/ops/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Smart Tasks & Workflow — Artist Ops Hub" },
      { name: "description", content: "Kanban board, list view and SLA heatmap for every team." },
      { property: "og:title", content: "Smart Tasks & Workflow — Artist Ops Hub" },
      { property: "og:description", content: "Kanban & SLA matrix for artist operations." },
    ],
  }),
  component: Tasks,
});

const COLS: { key: Status; title: string }[] = [
  { key: "backlog", title: "Backlog" }, { key: "progress", title: "In Progress" }, { key: "review", title: "In Review" }, { key: "done", title: "Completed" },
];
const SLA = [{ key: "ontime", label: "On Time", tone: "success" }, { key: "risk", label: "At Risk", tone: "warning" }, { key: "overdue", label: "Overdue", tone: "danger" }] as const;
const statusTone = { backlog: "muted", progress: "warning", review: "warning", done: "success" } as const;
const cellBg = { ontime: "bg-success-soft text-success", risk: "bg-warning-soft text-warning", overdue: "bg-danger-soft text-danger" };

function Tasks() {
  const { inScope, portfolio, search } = useWorkspace();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [filter, setFilter] = useState<{ team: string; sla: string } | null>(null);
  const [drag, setDrag] = useState<string | null>(null);

  const scoped = tasks.filter((t) => inScope(t.artist));
  const visible = useMemo(() => scoped.filter((t) =>
    (!filter || (t.team === filter.team && t.sla === filter.sla)) &&
    (!search || t.title.toLowerCase().includes(search.toLowerCase()))), [scoped, filter, search]);

  const move = (id: string, status: Status) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, status } : t)));

  return (
    <>
      <PageHeader title="Smart Tasks & Workflow" subtitle="Drag cards between columns · click a heatmap cell to filter"
        actions={<Segmented value={view} onChange={setView} options={[{ value: "kanban", label: "Kanban Board" }, { value: "list", label: "List View" }]} />} />

      <Panel className="mb-6 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold">SLA Heatmap</h2>
          <div className="flex gap-3 text-[11px] text-muted-foreground">
            {SLA.map((s) => <span key={s.key} className="flex items-center gap-1"><span className={cn("h-2.5 w-2.5 rounded-sm", cellBg[s.key])} />{s.label}</span>)}
          </div>
        </div>
        <div className="grid grid-cols-[140px_repeat(3,1fr)_110px] gap-1.5 text-xs">
          <div />
          {SLA.map((s) => <div key={s.key} className="px-2 font-semibold text-muted-foreground">{s.label}</div>)}
          <div className="px-2 font-semibold text-muted-foreground">Completion</div>
          {TEAMS.map((team) => {
            const rows = scoped.filter((t) => t.team === team);
            const done = rows.filter((t) => t.status === "done").length;
            return [
              <div key={team} className="flex items-center px-2 font-semibold">{team}</div>,
              ...SLA.map((s) => {
                const n = rows.filter((t) => t.sla === s.key).length;
                const on = filter?.team === team && filter.sla === s.key;
                return (
                  <button key={team + s.key} disabled={!n} onClick={() => setFilter(on ? null : { team, sla: s.key })}
                    className={cn("h-10 rounded-lg font-bold transition", n ? cellBg[s.key] : "bg-canvas text-muted-foreground", on && "ring-2 ring-primary", n && "hover:brightness-95")}>
                    {n}
                  </button>
                );
              }),
              <div key={team + "c"} className="flex items-center px-2 font-semibold">{rows.length ? Math.round((done / rows.length) * 100) : 0}%</div>,
            ];
          })}
        </div>
        {filter && (
          <button onClick={() => setFilter(null)} className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
            {filter.team} · {SLA.find((s) => s.key === filter.sla)!.label} <X className="h-3 w-3" />
          </button>
        )}
      </Panel>

      {view === "kanban" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {COLS.map((c) => {
            const items = visible.filter((t) => t.status === c.key);
            return (
              <div key={c.key} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (drag) move(drag, c.key); setDrag(null); }}
                className="rounded-xl border border-border bg-canvas p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="text-sm font-bold">{c.title}</span>
                  <span className="rounded-full bg-background px-2 text-[11px] font-semibold text-muted-foreground">{items.length}</span>
                </div>
                <div className="min-h-24 space-y-2">
                  {items.map((t) => (
                    <div key={t.id} draggable onDragStart={() => setDrag(t.id)}
                      className="cursor-grab rounded-lg border border-border bg-card p-3 shadow-sm active:cursor-grabbing">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted-foreground">{t.id}</span>
                        <Pill tone={t.priority === "high" ? "danger" : t.priority === "medium" ? "warning" : "muted"}>{t.priority}</Pill>
                      </div>
                      <div className="mt-1.5 text-sm font-semibold leading-snug">{t.title}</div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{t.team} · {t.owner}</span><span>{t.due}</span>
                      </div>
                      {portfolio && <div className="mt-2"><ArtistTag id={t.artist} /></div>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Panel className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>{["ID", "Task", "Artist", "Team", "Owner", "Status", "SLA", "Due"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((t) => (
                <tr key={t.id} className="hover:bg-canvas">
                  <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{t.id}</td>
                  <td className="px-4 py-3 font-semibold">{t.title}</td>
                  <td className="px-4 py-3"><ArtistTag id={t.artist} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{t.team}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.owner}</td>
                  <td className="px-4 py-3">
                    <select value={t.status} onChange={(e) => move(t.id, e.target.value as Status)} className="rounded-md border border-border bg-background px-2 py-1 text-xs">
                      {COLS.map((c) => <option key={c.key} value={c.key}>{c.title}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3"><Pill tone={SLA.find((s) => s.key === t.sla)!.tone}>{SLA.find((s) => s.key === t.sla)!.label}</Pill></td>
                  <td className="px-4 py-3 text-muted-foreground"><Pill tone={statusTone[t.status]} className="hidden" />{t.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </>
  );
}
