import type { LeagueId } from "./football";

const logoCodeAliases: Record<LeagueId, Record<string, string>> = {
  laliga: {
    BAR: "BAR", ATM: "ATM", RMA: "RMA", BET: "BET", RSO: "RSO", SEV: "SEV", ALA: "ALA", ATH: "ATH",
    CEL: "CEL", VIL: "VIL", DEP: "DEP", OSA: "OSA", RAC: "RAC", LEV: "LEV", ELC: "ELC", RAY: "RAY",
    GET: "GET", ESP: "ESP", VAL: "VAL", MGA: "MGA", MCF: "MGA",
  },
  "premier-league": {
    MCI: "MCI", MNC: "MCI", ARS: "ARS", BHA: "BHA", CHE: "CHE", LIV: "LIV", BRE: "BRE", BOU: "BOU",
    TOT: "TOT", AVL: "AVL", HUL: "HUL", LEE: "LEE", NEW: "NEW", IPS: "IPS", EVE: "EVE", FUL: "FUL",
    COV: "COV", MUN: "MUN", MAN: "MUN", CRY: "CRY", NFO: "NFO", SUN: "SUN",
  },
  bundesliga: {
    FCB: "FCB", MUN: "FCB", BAY: "FCB", BVB: "BVB", DOR: "BVB", SCF: "SCF", B04: "B04", ELV: "ELV",
    RBL: "RBL", SVW: "SVW", M05: "M05", FCA: "FCA", TSG: "TSG", HSV: "HSV", KOE: "KOE", SCP: "SCP",
    SGE: "SGE", VFB: "VFB", S04: "S04", FCU: "FCU", BMG: "BMG",
  },
};

export function canonicalTeamCode(leagueId: LeagueId, code: string): string {
  const canonicalCode = logoCodeAliases[leagueId][code.trim().toUpperCase()];
  return canonicalCode ?? code.trim().toUpperCase();
}

export function teamLogoPath(leagueId: LeagueId, code: string): string | null {
  const normalized = code.trim().toUpperCase();
  if (!logoCodeAliases[leagueId][normalized]) return null;
  return `/team-logos/${leagueId}/${canonicalTeamCode(leagueId, normalized).toLowerCase()}.png`;
}
