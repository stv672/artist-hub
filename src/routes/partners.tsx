import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, User } from "lucide-react";
import { PARTNERS, STAGES, type Stage } from "@/lib/data";
import { useWorkspace } from "@/lib/workspace";
import { ArtistTag, PageHeader, Panel } from "@/components/ops/ui";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partnership & Sponsorship CRM — Artist Ops Hub" },
      { name: "description", content: "Five-stage outreach pipeline for brand sponsorships and partnerships." },
      { property: "og:title", content: "Partnership & Sponsorship CRM — Artist Ops Hub" },
      { property: "og:description", content: "Track sponsorship deals from prospect to post-event report." },
    ],
  }),
  component: Partners,
});

function Partners() {
  const { inScope, search } = useWorkspace();
  const [deals, setDeals] = useState(PARTNERS);
  const [drag, setDrag] = useState<string | null>(null);
  const scoped = deals.filter((d) => inScope(d.artist) && (!search || d.brand.toLowerCase().includes(search.toLowerCase())));
  const moveTo = (brand: string, stage: Stage) => setDeals((ds) => ds.map((d) => (d.brand === brand ? { ...d, stage } : d)));
  const advance = (brand: string, stage: Stage) => {
    const i = STAGES.findIndex((s) => s.key === stage);
    if (i < STAGES.length - 1) moveTo(brand, STAGES[i + 1].key);
  };

  return (
    <>
      <PageHeader title="Partnership & Sponsorship CRM" subtitle={`${scoped.length} active deals in the outreach pipeline`} />
      <div className="grid gap-3 overflow-x-auto pb-2 lg:grid-cols-5">
        {STAGES.map((s, i) => {
          const items = scoped.filter((d) => d.stage === s.key);
          return (
            <div key={s.key} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (drag) moveTo(drag, s.key); setDrag(null); }}
              className="min-w-[220px] rounded-xl border border-border bg-canvas p-3">
              <div className="mb-3 px-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary">STAGE {i + 1}</span>
                  <span className="text-[11px] font-semibold text-muted-foreground">{items.length}</span>
                </div>
                <div className="text-sm font-bold leading-tight">{s.title}</div>
                <div className="text-[11px] text-muted-foreground">{s.sub}</div>
              </div>
              <div className="min-h-24 space-y-2">
                {items.map((d) => (
                  <Panel key={d.brand} className="cursor-grab p-3">
                    <div draggable onDragStart={() => setDrag(d.brand)}>
                      <div className="flex items-center gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-xs font-extrabold text-primary">{d.brand.slice(0, 2).toUpperCase()}</div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold">{d.brand}</div>
                          <div className="text-xs font-semibold text-foreground">{d.value}</div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground"><User className="h-3 w-3" /> {d.contact}</div>
                      <div className="mt-2"><ArtistTag id={d.artist} /></div>
                      <div className="mt-2 rounded-md bg-canvas px-2 py-1.5 text-[11px] text-muted-foreground"><span className="font-semibold text-foreground">Next:</span> {d.next}</div>
                      {i < STAGES.length - 1 && (
                        <button onClick={() => advance(d.brand, d.stage)} className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-primary">
                          Advance <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </Panel>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
