import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Palette, BookOpen, Workflow, HeartHandshake } from "lucide-react";
import { PageHeader, Panel, Segmented } from "@/components/ops/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vault")({
  head: () => ({
    meta: [
      { title: "Resource Vault & Ops Wiki — Artist Ops Hub" },
      { name: "description", content: "Live EPK and deck embeds plus the onboarding wiki: glossary, SOPs and artist etiquette." },
      { property: "og:title", content: "Resource Vault & Ops Wiki — Artist Ops Hub" },
      { property: "og:description", content: "Live embeds and onboarding kit for the ops team." },
    ],
  }),
  component: Vault,
});

const DOCS = [
  { key: "epk", title: "Artist EPK 2026.pdf", src: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf" },
  { key: "deck", title: "Sponsorship Deck v3.pdf", src: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf" },
];
const GLOSSARY = [
  { t: "EPK", d: "Electronic Press Kit — bio, photos, links, press quotes and tech rider in one shareable package." },
  { t: "DSP", d: "Digital Service Provider — Spotify, Apple Music, YouTube Music, Zing MP3, etc." },
  { t: "Submit", d: "Delivering a release (audio + metadata + artwork) to the distributor, ideally 4 weeks before release." },
  { t: "Pitching", d: "Submitting an unreleased track to DSP editorial teams for playlist consideration (≥7 days pre-release)." },
];
const SOP = ["Requester files an Asset Request brief", "Designer confirms specs within 24h (SLA)", "WIP shared in Canva frame for review", "Approved export uploaded to Vault /assets", "Requester marks task Completed"];
const ETIQUETTE = ["Never share unreleased audio outside the Vault.", "Confirm call times with the artist 24h ahead.", "All brand comms go through the Partnerships lead.", "No photos backstage without artist consent.", "Respect rest days — no messages after 22:00 unless urgent."];

function Vault() {
  const [tab, setTab] = useState<"embeds" | "wiki">("embeds");
  const [doc, setDoc] = useState(DOCS[0]!.key);
  const [wiki, setWiki] = useState<"glossary" | "sop" | "etiquette">("glossary");
  const active = DOCS.find((d) => d.key === doc)!;

  return (
    <>
      <PageHeader title="Resource Vault & Ops Wiki" subtitle="Live documents and onboarding kit"
        actions={<Segmented value={tab} onChange={setTab} options={[{ value: "embeds", label: "Live Embeds" }, { value: "wiki", label: "Ops Onboarding Wiki" }]} />} />

      {tab === "embeds" ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <Panel className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border p-3">
              <FileText className="h-4 w-4 text-primary" />
              {DOCS.map((d) => (
                <button key={d.key} onClick={() => setDoc(d.key)} className={cn("rounded-md px-2.5 py-1 text-xs font-semibold", doc === d.key ? "bg-primary-soft text-primary" : "text-muted-foreground hover:text-foreground")}>{d.title}</button>
              ))}
            </div>
            <iframe key={active.key} title={active.title} src={active.src} className="h-[560px] w-full bg-canvas" />
          </Panel>
          <Panel className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border p-3 text-xs font-semibold"><Palette className="h-4 w-4 text-violet" /> Canva WIP — EP Campaign Key Visual</div>
            <div className="grid h-[560px] place-items-center bg-canvas p-8">
              <div className="w-full max-w-md rounded-xl border border-dashed border-border bg-background p-8 text-center">
                <div className="mx-auto mb-4 aspect-[4/5] w-48 rounded-lg bg-gradient-primary shadow-brand" />
                <div className="text-sm font-bold">Canva frame embed</div>
                <p className="mt-1 text-xs text-muted-foreground">Paste a Canva "Embed" link to show the live design here. Updates sync as the designer works.</p>
              </div>
            </div>
          </Panel>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <Panel className="h-fit p-2">
            {[{ k: "glossary", l: "Industry Glossary", i: BookOpen }, { k: "sop", l: "Inter-Team SOPs", i: Workflow }, { k: "etiquette", l: "Artist Etiquette", i: HeartHandshake }].map((x) => (
              <button key={x.k} onClick={() => setWiki(x.k as typeof wiki)}
                className={cn("flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium", wiki === x.k ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-canvas")}>
                <x.i className="h-4 w-4" /> {x.l}
              </button>
            ))}
          </Panel>
          <Panel className="p-6">
            {wiki === "glossary" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {GLOSSARY.map((g) => (
                  <div key={g.t} className="rounded-xl border border-border p-4">
                    <div className="font-mono text-sm font-bold text-primary">{g.t}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{g.d}</p>
                  </div>
                ))}
              </div>
            )}
            {wiki === "sop" && (
              <>
                <h2 className="mb-4 text-sm font-bold">Asset Handoff Flow</h2>
                <ol className="space-y-3">
                  {SOP.map((s, i) => (
                    <li key={s} className="flex items-center gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                      <span className="text-sm">{s}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}
            {wiki === "etiquette" && (
              <ul className="space-y-2">
                {ETIQUETTE.map((e) => <li key={e} className="rounded-lg border border-border bg-canvas px-4 py-3 text-sm">{e}</li>)}
              </ul>
            )}
          </Panel>
        </div>
      )}
    </>
  );
}
