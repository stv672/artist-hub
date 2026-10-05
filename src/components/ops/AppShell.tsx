import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AudioWaveform, Check, ChevronDown, Plus, Search, LayoutDashboard, Map, Zap, Handshake, CalendarDays, FolderOpen, FileText, ImagePlus, Shirt } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ARTISTS } from "@/lib/data";
import { useWorkspace } from "@/lib/workspace";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Overview Desk", icon: LayoutDashboard },
  { to: "/roadmap", label: "Master Roadmap", icon: Map },
  { to: "/tasks", label: "Smart Tasks & Workflow", icon: Zap },
  { to: "/partners", label: "Partnership CRM", icon: Handshake },
  { to: "/calendar", label: "Master Calendar", icon: CalendarDays },
  { to: "/vault", label: "Resource Vault & Wiki", icon: FolderOpen },
] as const;

const TEMPLATES = [
  { key: "task", icon: FileText, title: "Standard Task", desc: "Owner, due date, priority & SLA." },
  { key: "asset", icon: ImagePlus, title: "Asset Request", desc: "Specs, format, handoff destination." },
  { key: "fitting", icon: Shirt, title: "Fitting Request", desc: "Brand, sizes, pickup & return." },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { artist, setArtist, portfolio, setPortfolio, search, setSearch } = useWorkspace();
  const [briefOpen, setBriefOpen] = useState(false);
  const [tpl, setTpl] = useState("task");
  const [title, setTitle] = useState("");
  const active = ARTISTS.find((a) => a.id === artist)!;

  return (
    <div className="min-h-screen">
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background px-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-brand">
            <AudioWaveform className="h-4 w-4" />
          </span>
          <span className="hidden text-sm font-bold tracking-tight lg:block">Artist Ops Hub</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-left hover:bg-canvas">
            <div>
              <div className="text-xs font-semibold leading-tight">{portfolio ? "All Artists" : active.name}</div>
              <div className="text-[10px] text-muted-foreground">{portfolio ? "Agency Portfolio" : active.label}</div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Workspaces</DropdownMenuLabel>
            {ARTISTS.map((a) => (
              <DropdownMenuItem key={a.id} onClick={() => { setArtist(a.id); setPortfolio(false); }}>
                <div className="flex-1">
                  <div className="text-sm font-medium">{a.name}</div>
                  <div className="text-[11px] text-muted-foreground">{a.label}</div>
                </div>
                {!portfolio && artist === a.id && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast("Artist onboarding coming soon")} className="text-primary">
              <Plus className="h-4 w-4" /> Add Artist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="relative mx-auto hidden max-w-xl flex-1 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks, partners, assets, calendar events across artists..."
            className="h-9 w-full rounded-lg border border-border bg-canvas pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:bg-background"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden rounded-lg border border-border bg-canvas p-0.5 xl:flex">
            {[{ v: false, l: "Single Artist" }, { v: true, l: "Agency Portfolio" }].map((o) => (
              <button key={o.l} onClick={() => setPortfolio(o.v)}
                className={cn("rounded-md px-2.5 py-1 text-xs font-semibold", portfolio === o.v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}>
                {o.l}
              </button>
            ))}
          </div>
          <button onClick={() => setBriefOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-brand transition hover:opacity-95">
            <Plus className="h-4 w-4" /> New Task / Brief
          </button>
          <div className="flex items-center gap-2 border-l border-border pl-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">DL</div>
            <div className="hidden leading-tight lg:block">
              <div className="text-xs font-semibold">Duy Lê</div>
              <div className="text-[10px] text-muted-foreground">Agency Manager · Super Admin</div>
            </div>
          </div>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-60 border-r border-border bg-sidebar p-3 md:block">
        <div className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Modules</div>
        <nav className="space-y-0.5">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-canvas hover:text-foreground"
              activeProps={{ className: "!bg-sidebar-accent !text-sidebar-accent-foreground" }}>
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="absolute inset-x-3 bottom-3 rounded-xl border border-border bg-canvas p-3">
          <div className="text-xs font-semibold">Google Workspace</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> SSO connected
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-0 top-16 z-30 flex gap-1 overflow-x-auto border-b border-border bg-background px-3 py-2 md:hidden">
        {NAV.map((n) => (
          <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground"
            activeProps={{ className: "!bg-sidebar-accent !text-sidebar-accent-foreground" }}>{n.label}</Link>
        ))}
      </nav>

      <main className="pt-28 md:pl-60 md:pt-16">
        <div className="mx-auto max-w-[1400px] p-6 lg:p-8">{children}</div>
      </main>

      <Dialog open={briefOpen} onOpenChange={setBriefOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Task / Brief</DialogTitle>
            <DialogDescription>Pick a Smart Brief template for {portfolio ? "the agency" : active.name}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 sm:grid-cols-3">
            {TEMPLATES.map((t) => (
              <button key={t.key} onClick={() => setTpl(t.key)}
                className={cn("rounded-xl border p-3 text-left transition", tpl === t.key ? "border-primary bg-primary-soft" : "border-border hover:bg-canvas")}>
                <t.icon className={cn("h-5 w-5", tpl === t.key ? "text-primary" : "text-muted-foreground")} />
                <div className="mt-2 text-sm font-semibold">{t.title}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{t.desc}</div>
              </button>
            ))}
          </div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brief title"
            className="h-10 rounded-lg border border-border px-3 text-sm outline-none focus:border-primary" />
          <button
            onClick={() => { toast.success(`Brief created: ${title || "Untitled"}`); setTitle(""); setBriefOpen(false); }}
            className="h-10 rounded-lg bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-brand">
            Create brief
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
