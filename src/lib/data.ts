export type ArtistId = "ita" | "themeo";
export const ARTISTS: { id: ArtistId; name: string; label: string }[] = [
  { id: "ita", name: "Into The Air", label: "Band Workspace" },
  { id: "themeo", name: "THEMÈO", label: "Solo Artist" },
];
export const artistName = (id: ArtistId) => ARTISTS.find((a) => a.id === id)!.name;

// Fixed "today" so server & client render identically.
export const TODAY = new Date(2026, 9, 5);

export const METRICS: Record<ArtistId, { listeners: string; listenersDelta: number; views: string; viewsDelta: number; engagement: string; engagementDelta: number; showday: string; showdayDate: Date }> = {
  ita: { listeners: "184.2K", listenersDelta: 12.4, views: "2.31M", viewsDelta: 8.1, engagement: "6.8%", engagementDelta: 0.9, showday: "Musicaland", showdayDate: new Date(2026, 8, 26) },
  themeo: { listeners: "92.7K", listenersDelta: 21.7, views: "1.04M", viewsDelta: 14.3, engagement: "9.2%", engagementDelta: -0.4, showday: "Hanoi Indie Fest", showdayDate: new Date(2026, 10, 14) },
};

export type Status = "backlog" | "progress" | "review" | "done";
export type Priority = "high" | "medium" | "low";
export type Task = { id: string; title: string; artist: ArtistId; team: string; owner: string; status: Status; priority: Priority; due: string; sla: "ontime" | "risk" | "overdue" };

export const TEAMS = ["Production", "Marketing", "Styling", "Logistics", "Partnerships"];

export const TASKS: Task[] = [
  { id: "T-101", title: "Final mastering — 'Gió Mùa' single", artist: "ita", team: "Production", owner: "Minh", status: "progress", priority: "high", due: "Oct 08", sla: "risk" },
  { id: "T-102", title: "EP artwork final export (3000px)", artist: "ita", team: "Marketing", owner: "Linh", status: "review", priority: "high", due: "Oct 06", sla: "ontime" },
  { id: "T-103", title: "Press release draft — EP launch", artist: "ita", team: "Marketing", owner: "Hà", status: "backlog", priority: "medium", due: "Oct 15", sla: "ontime" },
  { id: "T-104", title: "Outfit fitting #2 with Local Brand X", artist: "ita", team: "Styling", owner: "Trang", status: "progress", priority: "medium", due: "Oct 03", sla: "overdue" },
  { id: "T-105", title: "Stage plot & rider to venue", artist: "ita", team: "Logistics", owner: "Quân", status: "done", priority: "high", due: "Sep 20", sla: "ontime" },
  { id: "T-106", title: "Sponsorship deck v3 for Highlands", artist: "ita", team: "Partnerships", owner: "Duy", status: "review", priority: "high", due: "Oct 04", sla: "overdue" },
  { id: "T-107", title: "TikTok teaser batch (5 clips)", artist: "ita", team: "Marketing", owner: "Linh", status: "progress", priority: "low", due: "Oct 12", sla: "ontime" },
  { id: "T-201", title: "Vocal comp — 'Đêm Trắng'", artist: "themeo", team: "Production", owner: "Minh", status: "backlog", priority: "medium", due: "Oct 20", sla: "ontime" },
  { id: "T-202", title: "DSP pitching — Spotify editorial", artist: "themeo", team: "Marketing", owner: "Hà", status: "progress", priority: "high", due: "Oct 07", sla: "risk" },
  { id: "T-203", title: "Shoe sponsor follow-up call", artist: "themeo", team: "Partnerships", owner: "Duy", status: "backlog", priority: "low", due: "Oct 18", sla: "ontime" },
  { id: "T-204", title: "Rehearsal room booking (Nov)", artist: "themeo", team: "Logistics", owner: "Quân", status: "done", priority: "medium", due: "Sep 30", sla: "ontime" },
  { id: "T-205", title: "Lookbook shoot moodboard", artist: "themeo", team: "Styling", owner: "Trang", status: "review", priority: "medium", due: "Oct 05", sla: "risk" },
];

export const MILESTONES = [
  { title: "EP 'Mùa Bay' DSP release", artist: "ita" as ArtistId, date: "Oct 24", progress: 72 },
  { title: "Press tour kickoff — Hanoi", artist: "ita" as ArtistId, date: "Nov 03", progress: 40 },
  { title: "Year-end showcase", artist: "ita" as ArtistId, date: "Dec 19", progress: 15 },
  { title: "Single 'Đêm Trắng' release", artist: "themeo" as ArtistId, date: "Oct 30", progress: 55 },
  { title: "Hanoi Indie Fest", artist: "themeo" as ArtistId, date: "Nov 14", progress: 35 },
  { title: "Brand capsule drop", artist: "themeo" as ArtistId, date: "Dec 05", progress: 10 },
];

// Roadmap: dates are day offsets from Sep 1 2026 (Sep=30, Oct=31, Nov=30, Dec=31 → 122 days)
export const ROADMAP_START = new Date(2026, 8, 1);
export const ROADMAP_DAYS = 122;
export type Lane = { key: string; icon: string; name: string; bars: { label: string; start: number; end: number; pct: number; artist: ArtistId }[]; milestones: { label: string; day: number; artist: ArtistId }[] };
export const LANES: Lane[] = [
  { key: "music", icon: "🎵", name: "Music Production", bars: [
    { label: "Track Mastering", start: 3, end: 40, pct: 85, artist: "ita" },
    { label: "Vocal Comp & Mix", start: 20, end: 55, pct: 45, artist: "themeo" },
    { label: "EP Launch", start: 45, end: 70, pct: 20, artist: "ita" },
  ], milestones: [{ label: "EP Release", day: 53, artist: "ita" }, { label: "Single Release", day: 59, artist: "themeo" }] },
  { key: "mkt", icon: "📢", name: "Marketing & PR Campaign", bars: [
    { label: "Teasers", start: 15, end: 52, pct: 60, artist: "ita" },
    { label: "Press Releases", start: 50, end: 85, pct: 10, artist: "ita" },
    { label: "DSP Pitching", start: 28, end: 45, pct: 70, artist: "themeo" },
  ], milestones: [{ label: "Press Tour", day: 63, artist: "ita" }] },
  { key: "style", icon: "👗", name: "Styling & Sponsorship", bars: [
    { label: "Brand Outreach", start: 0, end: 38, pct: 90, artist: "ita" },
    { label: "Fittings", start: 25, end: 60, pct: 50, artist: "themeo" },
    { label: "Capsule Production", start: 65, end: 95, pct: 0, artist: "themeo" },
  ], milestones: [{ label: "Capsule Drop", day: 95, artist: "themeo" }] },
  { key: "live", icon: "🎪", name: "Live Show Logistics", bars: [
    { label: "Rehearsals", start: 5, end: 25, pct: 100, artist: "ita" },
    { label: "Fest Rehearsals", start: 55, end: 74, pct: 0, artist: "themeo" },
    { label: "Showcase Prep", start: 85, end: 109, pct: 0, artist: "ita" },
  ], milestones: [{ label: "Musicaland Showday", day: 25, artist: "ita" }, { label: "Indie Fest", day: 74, artist: "themeo" }, { label: "Showcase", day: 109, artist: "ita" }] },
];

export type Stage = "prospect" | "outreach" | "negotiation" | "confirmed" | "post";
export const STAGES: { key: Stage; title: string; sub: string }[] = [
  { key: "prospect", title: "Prospect / Target", sub: "Research" },
  { key: "outreach", title: "Outreach & Pitching", sub: "EPK sent" },
  { key: "negotiation", title: "Negotiation & Agreement", sub: "Terms & value" },
  { key: "confirmed", title: "Confirmed & Execution", sub: "Outfits / logistics locked" },
  { key: "post", title: "Post-Event & Report", sub: "Report sent" },
];
export const PARTNERS: { brand: string; contact: string; value: string; artist: ArtistId; next: string; stage: Stage }[] = [
  { brand: "Highlands Coffee", contact: "Ngọc Anh — Brand Mgr", value: "₫250M", artist: "ita", next: "Send deck v3 · Oct 06", stage: "negotiation" },
  { brand: "Biti's Hunter", contact: "Tuấn — Partnerships", value: "₫180M", artist: "themeo", next: "Follow-up call · Oct 18", stage: "outreach" },
  { brand: "Local Brand X", contact: "Mai — Founder", value: "Outfits (in-kind)", artist: "ita", next: "Fitting #2 · Oct 08", stage: "confirmed" },
  { brand: "Yamaha Music VN", contact: "Hoàng — Marketing", value: "₫120M", artist: "ita", next: "Recap report · Oct 10", stage: "post" },
  { brand: "Grab Vietnam", contact: "TBD", value: "Est. ₫400M", artist: "themeo", next: "Find decision maker", stage: "prospect" },
  { brand: "Shopee Music", contact: "Lan — Content Lead", value: "₫90M", artist: "themeo", next: "Contract redline · Oct 09", stage: "negotiation" },
  { brand: "Coolmate", contact: "Đức — Brand", value: "₫60M + outfits", artist: "themeo", next: "Pickup outfits · Oct 12", stage: "confirmed" },
  { brand: "Heineken VN", contact: "TBD", value: "Est. ₫500M", artist: "ita", next: "Warm intro via agency", stage: "prospect" },
];

export type EventType = "show" | "rehearsal" | "media" | "styling";
export const EVENT_TYPES: { key: EventType; label: string; dot: string; pill: string }[] = [
  { key: "show", label: "Live Shows & Performances", dot: "bg-success", pill: "bg-success-soft text-success" },
  { key: "rehearsal", label: "Rehearsals & Soundchecks", dot: "bg-primary", pill: "bg-primary-soft text-primary" },
  { key: "media", label: "Media, Press & PR Tours", dot: "bg-violet", pill: "bg-violet-soft text-violet" },
  { key: "styling", label: "Styling, Fittings & Pickups", dot: "bg-warning", pill: "bg-warning-soft text-warning" },
];
export type CalEvent = { id: string; title: string; date: Date; time: string; type: EventType; artist: ArtistId; location: string; notes: string };
export const EVENTS: CalEvent[] = [
  { id: "e1", title: "Full band rehearsal", date: new Date(2026, 9, 5), time: "14:00–18:00", type: "rehearsal", artist: "ita", location: "Studio 9, Q.3", notes: "Run EP set top to bottom." },
  { id: "e2", title: "VTV Radio interview", date: new Date(2026, 9, 7), time: "10:00–11:00", type: "media", artist: "ita", location: "VOV Building", notes: "Talking points in Wiki." },
  { id: "e3", title: "Fitting #2 — Local Brand X", date: new Date(2026, 9, 8), time: "15:00–17:00", type: "styling", artist: "ita", location: "Brand X Atelier", notes: "Bring stage shoes." },
  { id: "e4", title: "Outfit pickup — Coolmate", date: new Date(2026, 9, 12), time: "11:00", type: "styling", artist: "themeo", location: "Coolmate HQ", notes: "" },
  { id: "e5", title: "Acoustic session — Saigon Phố", date: new Date(2026, 9, 10), time: "20:00–22:00", type: "show", artist: "themeo", location: "Saigon Phố Café", notes: "45-min set." },
  { id: "e6", title: "Soundcheck — Indie night", date: new Date(2026, 9, 16), time: "16:00", type: "rehearsal", artist: "themeo", location: "Acoustic Bar", notes: "" },
  { id: "e7", title: "Indie night live", date: new Date(2026, 9, 16), time: "21:00", type: "show", artist: "themeo", location: "Acoustic Bar", notes: "" },
  { id: "e8", title: "EP listening party (press)", date: new Date(2026, 9, 22), time: "19:00", type: "media", artist: "ita", location: "The Workshop", notes: "Invite list in Vault." },
  { id: "e9", title: "EP launch show", date: new Date(2026, 9, 24), time: "20:00", type: "show", artist: "ita", location: "Hồ Gươm Opera", notes: "" },
  { id: "e10", title: "Podcast — Have A Sip", date: new Date(2026, 9, 28), time: "14:00", type: "media", artist: "themeo", location: "Remote", notes: "" },
  { id: "e11", title: "Tech rehearsal", date: new Date(2026, 9, 21), time: "13:00", type: "rehearsal", artist: "ita", location: "Hồ Gươm Opera", notes: "" },
  { id: "e12", title: "Lookbook shoot", date: new Date(2026, 9, 14), time: "08:00", type: "styling", artist: "themeo", location: "Studio Q.2", notes: "" },
];
