import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LANES, ROADMAP_DAYS, ROADMAP_START, TODAY, artistName } from "@/lib/data";
import { useWorkspace } from "@/lib/workspace";
import { PageHeader, Panel, Pill } from "@/components/ops/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Master Roadmap — Artist Ops Hub" },
      { name: "description", content: "Q3/Q4 2026 Gantt campaign timeline across production, marketing, styling and live shows." },
      { property: "og:title", content: "Master Roadmap — Artist Ops Hub" },
      { property: "og:description", content: "Gantt campaign timeline with phases and milestones." },
    ],
  }),
  component: Roadmap,
});

const MONTHS = [{ n: "September", d: 30 }, { n: "October", d: 31 }, { n: "November", d: 30 }, { n: "December", d: 31 }];
const pct = (day: number) => `${(day / ROADMAP_DAYS) * 100}%`;
const fmt = (day: number) => { const d = new Date(ROADMAP_START); d.setDate(d.getDate() + day); return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }); };

function Roadmap() {
  const { inScope } = useWorkspace();
  const [sel, setSel] = useState<string | null>(null);
  const todayDay = Math.round((TODAY.getTime() - ROADMAP_START.getTime()) / 86400000);

  return (
    <>
      <PageHeader title="Master Roadmap" subtitle="Q3 / Q4 2026 campaign timeline" actions={<Pill tone="primary">Today · {fmt(todayDay)}</Pill>} />
      <Panel className="overflow-x-auto">
        <div className="min-w-[960px]">
          <div className="flex border-b border-border">
            <div className="w-56 shrink-0 border-r border-border px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Swimlane</div>
            <div className="flex flex-1">
              {MONTHS.map((m, i) => (
                <div key={m.n} style={{ flex: m.d }} className="border-r border-border px-3 py-3 last:border-r-0">
                  <div className="text-xs font-bold">{m.n}</div>
                  <div className="text-[10px] text-muted-foreground">{i === 0 ? "Q3" : "Q4"} 2026</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            {LANES.map((lane) => {
              const bars = lane.bars.filter((b) => inScope(b.artist));
              const ms = lane.milestones.filter((b) => inScope(b.artist));
              return (
                <div key={lane.key} className="flex border-b border-border last:border-b-0">
                  <div className="w-56 shrink-0 border-r border-border px-4 py-4">
                    <div className="text-sm font-semibold">{lane.icon} {lane.name}</div>
                    <div className="text-[11px] text-muted-foreground">{bars.length} phases · {ms.length} milestones</div>
                  </div>
                  <div className="relative flex-1 py-3" style={{ minHeight: Math.max(1, bars.length) * 40 + 36 }}>
                    {bars.map((b, i) => {
                      const id = lane.key + b.label;
                      return (
                        <button key={id} onClick={() => setSel(sel === id ? null : id)}
                          title={`${b.label} · ${fmt(b.start)} → ${fmt(b.end)} · ${b.pct}%`}
                          className={cn("absolute h-8 overflow-hidden rounded-lg border text-left transition", sel === id ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50", "bg-primary-soft")}
                          style={{ left: pct(b.start), width: pct(b.end - b.start), top: 12 + i * 40 }}>
                          <div className="absolute inset-y-0 left-0 bg-gradient-primary opacity-90" style={{ width: `${b.pct}%` }} />
                          <div className="relative flex h-full items-center justify-between gap-2 px-2.5">
                            <span className={cn("truncate text-[11px] font-semibold", b.pct > 45 ? "text-primary-foreground" : "text-foreground")}>{b.label}</span>
                            <span className={cn("text-[10px] font-bold", b.pct > 92 ? "text-primary-foreground" : "text-primary")}>{b.pct}%</span>
                          </div>
                        </button>
                      );
                    })}
                    {ms.map((m) => (
                      <div key={m.label} className="group absolute bottom-2 -translate-x-1/2" style={{ left: pct(m.day) }}>
                        <div className="h-3 w-3 rotate-45 border-2 border-background bg-foreground shadow-sm" />
                        <div className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[10px] font-semibold text-background group-hover:block">
                          {m.label} · {fmt(m.day)} · {artistName(m.artist)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="pointer-events-none absolute inset-y-0 left-56 right-0">
              <div className="absolute inset-y-0 w-0.5 bg-primary today-pulse" style={{ left: pct(todayDay) }}>
                <span className="absolute -top-0 left-1/2 -translate-x-1/2 rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">TODAY</span>
              </div>
            </div>
          </div>
        </div>
      </Panel>
      {sel && (() => {
        const lane = LANES.find((l) => sel.startsWith(l.key))!;
        const b = lane.bars.find((x) => lane.key + x.label === sel)!;
        return (
          <Panel className="mt-4 flex flex-wrap items-center gap-6 p-4 text-sm">
            <div className="font-bold">{b.label}</div>
            <div className="text-muted-foreground">{lane.name}</div>
            <div>{fmt(b.start)} → {fmt(b.end)}</div>
            <Pill tone={b.pct === 100 ? "success" : b.pct > 0 ? "warning" : "muted"}>{b.pct}% complete</Pill>
            <div className="text-muted-foreground">{artistName(b.artist)}</div>
          </Panel>
        );
      })()}
    </>
  );
}
