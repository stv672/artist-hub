import { createContext, useContext, useState, type ReactNode } from "react";
import type { ArtistId } from "./data";

type Ctx = {
  artist: ArtistId;
  setArtist: (a: ArtistId) => void;
  portfolio: boolean;
  setPortfolio: (v: boolean) => void;
  inScope: (a: ArtistId) => boolean;
  search: string;
  setSearch: (s: string) => void;
};
const WorkspaceCtx = createContext<Ctx | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [artist, setArtist] = useState<ArtistId>("ita");
  const [portfolio, setPortfolio] = useState(false);
  const [search, setSearch] = useState("");
  const inScope = (a: ArtistId) => portfolio || a === artist;
  return (
    <WorkspaceCtx.Provider value={{ artist, setArtist, portfolio, setPortfolio, inScope, search, setSearch }}>
      {children}
    </WorkspaceCtx.Provider>
  );
}

export function useWorkspace() {
  const c = useContext(WorkspaceCtx);
  if (!c) throw new Error("useWorkspace outside provider");
  return c;
}
