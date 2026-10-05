import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Flag, AlertTriangle } from "lucide-react";
import { METRICS, MILESTONES, TASKS, TODAY, ARTISTS } from "@/lib/data";
import { useWorkspace } from "@/lib/workspace";
import { ArtistTag, PageHeader, Panel, Pill } from "@/components/ops/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview Desk — Artist Ops Hub" },
      { name: "description", content: "Live health dashboard: showday countdown, streaming metrics, milestones and urgent tasks." },
      { property: "og:title", content: "Overview Desk — Artist Ops Hub" },
      { property: "og:description", content: "Live health dashboard for your artists." },
    ],
  }),
  component: Overview,
});

function Delta({ v }: { v: number }) {
  const up = v >= 0;
  return (
    <span className={`inline-flex items-center text-xs font-semibold ${up ? "text-success" : "text-danger"}`}>
      {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
      {Math.abs(v)}%
    </span>
  );
}

function Overview() {
  const { artist, portfolio, inScope } = useWorkspace();
  const ids = portfolio ? ARTISTS.map((a) => a.id) : [artist];
  const m = METRICS[artist];
  const days = Math.round((m.showdayDate.getTime() - TODAY.getTime()) / 86400000);
  const dd = String(m.showdayDate.getDate()).padStart(2, "0") + "/" + String(m.showdayDate.getMonth() + 1).padStart(2, "0");
  const milestones = MILESTONES.filter((x) => inScope(x.artist)).slice(0, 3);
  const urgent = TASKS.filter((t) => inScope(t.artist) && t.priority === "high" && t.status !== "done");

  return (
    <>
      <PageHeader title="Overview Desk" subtitle={portfolio ? "Agency portfolio health across all artists" : `Health dashboard for ${ARTISTS.find((a) => a.id === artist)!.name}`} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Panel className="relative overflow-hidden p-5">
          <div className="text-xs font-medium text-muted-foreground">Showday Countdown</div>
          <div className="mt-3 text-3xl font-extrabold tracking-tight">{days >= 0 ? `D-${days}` : "Wrapped"}</div>
          <div className="mt-1 text-sm font-semibold text-primary">{dd} {m.showday}</div>
          <div className="mt-1 text-xs text-muted-foreground">{days >= 0 ? "until doors open" : `${-days} days ago · recap due`}</div>
        </Panel>
        {[
          { label: "Spotify Monthly Listeners", value: portfolio ? "276.9K" : m.listeners, d: m.listenersDelta },
          { label: "YouTube MV Views", value: portfolio ? "3.35M" : m.views, d: m.viewsDelta },
          { label: "Instagram Engagement", value: portfolio ? "7.6%" : m.engagement, d: m.engagementDelta },
        ].map((c) => (
          <Panel key={c.label} className="p-5">
            <div className="text-xs font-medium text-muted-foreground">{c.label}</div>
            <div className="mt-3 text-3xl font-extrabold tracking-tight">{c.value}</div>
            <div className="mt-1 flex items-center gap-1.5"><Delta v={c.d} /><span className="text-xs text-muted-foreground">vs last 28 days</span></div>
          </Panel>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Panel className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold"><Flag className="h-4 w-4 text-primary" /> Upcoming Milestones</h2>
            <Link to="/roadmap" className="text-xs font-semibold text-primary">Roadmap →</Link>
          </div>
          <div className="space-y-4">
            {milestones.map((x) => (
              <div key={x.title}>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold">{x.title}</div>
                  <span className="text-xs text-muted-foreground">{x.date}</span>
                </div>
                <div className="mt-1 flex items-center gap-2">{ids.length > 1 && <ArtistTag id={x.artist} />}<span className="text-[11px] text-muted-foreground">{x.progress}% complete</span></div>
                <div className="mt-2 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-gradient-primary" style={{ width: `${x.progress}%` }} /></div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold"><AlertTriangle className="h-4 w-4 text-danger" /> Urgent Task Snapshot</h2>
            <Link to="/tasks" className="text-xs font-semibold text-primary">All tasks →</Link>
          </div>
          <div className="divide-y divide-border">
            {urgent.map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-3">
                <span className="w-14 font-mono text-[11px] text-muted-foreground">{t.id}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{t.title}</div>
                  <div className="text-[11px] text-muted-foreground">{t.team} · {t.owner}</div>
                </div>
                {ids.length > 1 && <ArtistTag id={t.artist} />}
                <Pill tone={t.sla === "overdue" ? "danger" : t.sla === "risk" ? "warning" : "success"}>{t.sla === "overdue" ? "Overdue" : t.sla === "risk" ? "At risk" : "On time"}</Pill>
                <span className="w-12 text-right text-xs text-muted-foreground">{t.due}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
