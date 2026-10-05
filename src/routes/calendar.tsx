import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EVENTS, EVENT_TYPES, TODAY, ARTISTS, artistName, type CalEvent, type EventType } from "@/lib/data";
import { useWorkspace } from "@/lib/workspace";
import { ArtistTag, PageHeader, Panel, Segmented } from "@/components/ops/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Master Calendar — Artist Ops Hub" },
      { name: "description", content: "Month, week, day and agenda views for shows, rehearsals, press and fittings." },
      { property: "og:title", content: "Master Calendar — Artist Ops Hub" },
      { property: "og:description", content: "Color-coded multi-artist calendar." },
    ],
  }),
  component: CalendarPage,
});

type View = "month" | "week" | "day" | "agenda";
const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const typeOf = (t: EventType) => EVENT_TYPES.find((x) => x.key === t)!;
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

function CalendarPage() {
  const { artist, portfolio } = useWorkspace();
  const [view, setView] = useState<View>("month");
  const [cursor, setCursor] = useState(TODAY);
  const [overlay, setOverlay] = useState(portfolio);
  const [types, setTypes] = useState<EventType[]>(EVENT_TYPES.map((t) => t.key));
  const [events, setEvents] = useState<CalEvent[]>(EVENTS);
  const [open, setOpen] = useState<CalEvent | null>(null);
  const [creating, setCreating] = useState<Date | null>(null);
  const [form, setForm] = useState({ title: "", type: "rehearsal" as EventType, time: "10:00" });

  const showAll = overlay || portfolio;
  const evs = events.filter((e) => (showAll || e.artist === artist) && types.includes(e.type));
  const on = (d: Date) => evs.filter((e) => same(e.date, d));

  const shift = (dir: number) => {
    if (view === "month") setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + dir, 1));
    else setCursor(addDays(cursor, dir * (view === "week" ? 7 : 1)));
  };

  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const gridStart = addDays(monthStart, -((monthStart.getDay() + 6) % 7));
  const weekStart = addDays(cursor, -((cursor.getDay() + 6) % 7));

  const Chip = ({ e }: { e: CalEvent }) => (
    <button onClick={(ev) => { ev.stopPropagation(); setOpen(e); }} className={cn("block w-full truncate rounded px-1.5 py-0.5 text-left text-[10px] font-semibold", typeOf(e.type).pill)}>
      {e.time.split("–")[0]} {e.title}
    </button>
  );

  return (
    <>
      <PageHeader title="Master Calendar"
        subtitle={cursor.toLocaleDateString("en-GB", view === "day" ? { weekday: "long", day: "numeric", month: "long", year: "numeric" } : { month: "long", year: "numeric" })}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-lg border border-border bg-background">
              <button onClick={() => shift(-1)} className="p-2 text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /></button>
              <button onClick={() => setCursor(TODAY)} className="px-2 text-xs font-semibold">Today</button>
              <button onClick={() => shift(1)} className="p-2 text-muted-foreground hover:text-foreground"><ChevronRight className="h-4 w-4" /></button>
            </div>
            <Segmented value={view} onChange={setView} options={[{ value: "month", label: "Month" }, { value: "week", label: "Week" }, { value: "day", label: "Day" }, { value: "agenda", label: "Agenda" }]} />
            <button onClick={() => setCreating(cursor)} className="flex items-center gap-1 rounded-lg bg-gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-brand"><Plus className="h-3.5 w-3.5" /> Event</button>
          </div>
        } />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div className="space-y-4">
          <Panel className="p-4">
            <div className="mb-2 text-xs font-bold">Event Types</div>
            {EVENT_TYPES.map((t) => (
              <label key={t.key} className="flex cursor-pointer items-center gap-2 py-1 text-xs">
                <input type="checkbox" checked={types.includes(t.key)} onChange={() => setTypes((ts) => ts.includes(t.key) ? ts.filter((x) => x !== t.key) : [...ts, t.key])} className="accent-primary" />
                <span className={cn("h-2 w-2 rounded-full", t.dot)} /> {t.label}
              </label>
            ))}
          </Panel>
          <Panel className="p-4">
            <label className="flex cursor-pointer items-center justify-between text-xs font-bold">
              Multi-Artist Overlay
              <input type="checkbox" checked={showAll} disabled={portfolio} onChange={(e) => setOverlay(e.target.checked)} className="accent-primary" />
            </label>
            <div className="mt-2 space-y-1">{ARTISTS.map((a) => <div key={a.id} className={cn("text-xs", !showAll && a.id !== artist && "opacity-40")}><ArtistTag id={a.id} /></div>)}</div>
          </Panel>
        </div>

        <Panel className="overflow-hidden">
          {view === "month" && (
            <div className="grid grid-cols-7">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} className="border-b border-border px-2 py-2 text-[11px] font-semibold text-muted-foreground">{d}</div>)}
              {Array.from({ length: 42 }, (_, i) => addDays(gridStart, i)).map((d) => (
                <div key={d.toISOString()} onClick={() => setCreating(d)}
                  className={cn("min-h-24 cursor-pointer border-b border-r border-border p-1.5 hover:bg-canvas", d.getMonth() !== cursor.getMonth() && "bg-canvas/60 text-muted-foreground")}>
                  <div className={cn("mb-1 grid h-6 w-6 place-items-center rounded-full text-xs font-semibold", same(d, TODAY) && "bg-primary text-primary-foreground")}>{d.getDate()}</div>
                  <div className="space-y-0.5">{on(d).slice(0, 3).map((e) => <Chip key={e.id} e={e} />)}</div>
                </div>
              ))}
            </div>
          )}
          {(view === "week" || view === "day") && (
            <div className={cn("grid", view === "week" ? "grid-cols-7" : "grid-cols-1")}>
              {Array.from({ length: view === "week" ? 7 : 1 }, (_, i) => view === "week" ? addDays(weekStart, i) : cursor).map((d) => (
                <div key={d.toISOString()} className="min-h-[420px] border-r border-border last:border-r-0">
                  <div className={cn("border-b border-border px-3 py-2 text-xs font-semibold", same(d, TODAY) && "text-primary")}>
                    {d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric" })}
                  </div>
                  <div className="space-y-1.5 p-2">
                    {on(d).map((e) => (
                      <button key={e.id} onClick={() => setOpen(e)} className={cn("block w-full rounded-lg p-2 text-left", typeOf(e.type).pill)}>
                        <div className="text-[10px] font-bold">{e.time}</div>
                        <div className="text-xs font-semibold">{e.title}</div>
                        {showAll && <div className="text-[10px] opacity-80">{artistName(e.artist)}</div>}
                      </button>
                    ))}
                    {!on(d).length && <div className="p-2 text-[11px] text-muted-foreground">No events</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
          {view === "agenda" && (
            <div className="divide-y divide-border">
              {[...evs].sort((a, b) => a.date.getTime() - b.date.getTime()).map((e) => (
                <button key={e.id} onClick={() => setOpen(e)} className="flex w-full items-center gap-4 px-5 py-3 text-left hover:bg-canvas">
                  <div className="w-16 text-center">
                    <div className="text-[10px] font-semibold uppercase text-muted-foreground">{e.date.toLocaleDateString("en-GB", { month: "short" })}</div>
                    <div className="text-xl font-extrabold">{e.date.getDate()}</div>
                  </div>
                  <span className={cn("h-2.5 w-2.5 rounded-full", typeOf(e.type).dot)} />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{e.title}</div>
                    <div className="text-xs text-muted-foreground">{e.time} · {e.location}</div>
                  </div>
                  <ArtistTag id={e.artist} />
                </button>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent>
          {open && (
            <>
              <SheetHeader>
                <span className={cn("w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold", typeOf(open.type).pill)}>{typeOf(open.type).label}</span>
                <SheetTitle className="text-xl">{open.title}</SheetTitle>
                <SheetDescription>{open.date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} · {open.time}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> {open.location}</div>
                <ArtistTag id={open.artist} />
                <div className="rounded-lg border border-border bg-canvas p-3 text-muted-foreground">{open.notes || "No notes yet."}</div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={!!creating} onOpenChange={(o) => !o && setCreating(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Quick event · {creating?.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</DialogTitle></DialogHeader>
          <input autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" className="h-10 rounded-lg border border-border px-3 text-sm outline-none focus:border-primary" />
          <div className="flex gap-2">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as EventType })} className="h-10 flex-1 rounded-lg border border-border px-2 text-sm">
              {EVENT_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
            </select>
            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="h-10 rounded-lg border border-border px-2 text-sm" />
          </div>
          <button onClick={() => {
            if (!creating) return;
            setEvents((es) => [...es, { id: `n${es.length}`, title: form.title || "Untitled", date: creating, time: form.time, type: form.type, artist, location: "TBD", notes: "" }]);
            setForm({ ...form, title: "" }); setCreating(null);
          }} className="h-10 rounded-lg bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-brand">Add event</button>
        </DialogContent>
      </Dialog>
    </>
  );
}
