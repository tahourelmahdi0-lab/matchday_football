import { standingsSnapshot } from "./standingsSnapshot";

export type LeagueId = "laliga" | "premier-league" | "bundesliga";

export type League = {
  id: LeagueId;
  name: string;
  shortName: string;
  country: string;
  accent: string;
  apiCode: string;
  officialUrl: string;
  tableUrl: string;
};

export type Standing = {
  position: number;
  shortName: string;
  team: string;
  played: number;
  goalDifference: number;
  goalsFor?: number;
  points: number;
};

export type Match = {
  id: string;
  leagueId: LeagueId;
  kickoff: string;
  home: string;
  away: string;
  homeShort: string;
  awayShort: string;
  homeScore?: string;
  awayScore?: string;
  phase: "upcoming" | "live" | "finished" | "other";
  status: string;
  source: string;
};

export type UpcomingMatch = {
  leagueId: LeagueId;
  team: string;
  shortName: string;
  date: string;
  time: string;
  opponent: string;
  opponentShort: string;
  venue: "Domicile" | "Extérieur" | "À confirmer";
  competition: string;
  sourceUrl: string;
  note?: string;
};

export const leagues: League[] = [
  {
    id: "laliga",
    name: "La Liga",
    shortName: "LALIGA",
    country: "Espagne",
    accent: "#f58d43",
    apiCode: "esp.1",
    officialUrl: "https://www.laliga.com/en-GB/laliga-easports/calendar",
    tableUrl: "https://www.laliga.com/en-GB/laliga-easports/standing",
  },
  {
    id: "premier-league",
    name: "Premier League",
    shortName: "PREMIER LEAGUE",
    country: "Angleterre",
    accent: "#c58aff",
    apiCode: "eng.1",
    officialUrl: "https://www.premierleague.com/en/matches/premier-league/2026-27",
    tableUrl: "https://www.premierleague.com/en/tables/premier-league/2026-27",
  },
  {
    id: "bundesliga",
    name: "Bundesliga",
    shortName: "BUNDESLIGA",
    country: "Allemagne",
    accent: "#ff6a67",
    apiCode: "ger.1",
    officialUrl: "https://www.bundesliga.com/en/bundesliga/matchday",
    tableUrl: "https://www.bundesliga.com/en/bundesliga/table",
  },
];

// Snapshot de secours au 1er novembre 2026; mis à jour par ESPN dès le chargement.
export const standings: Record<LeagueId, Standing[]> = standingsSnapshot;

export const upcomingMatches: UpcomingMatch[] = [
  {
    leagueId: "laliga", team: "FC Barcelona", shortName: "BAR", date: "2026-11-08", time: "21:00 CET",
    opponent: "Atlético Madrid", opponentShort: "ATM", venue: "Extérieur", competition: "La Liga · 12e journée",
    sourceUrl: "https://www.fcbarcelona.com/en/matches/138391/atletico-madrid-fc-barcelona-la-liga-2026-2027",
    note: "Au Riyadh Air Metropolitano.",
  },
  {
    leagueId: "laliga", team: "Atlético de Madrid", shortName: "ATM", date: "2026-11-08", time: "21:00 CET",
    opponent: "FC Barcelona", opponentShort: "BAR", venue: "Domicile", competition: "La Liga · 12e journée",
    sourceUrl: "https://www.atleticodemadrid.com/calendario-completo-primer-equipo/",
    note: "Prochaine rencontre de championnat, au Riyadh Air Metropolitano.",
  },
  {
    leagueId: "laliga", team: "Real Madrid", shortName: "RMA", date: "2026-11-01", time: "15:15 CET",
    opponent: "Racing de Santander", opponentShort: "RAC", venue: "Extérieur", competition: "La Liga · 11e journée",
    sourceUrl: "https://www.laliga.com/en-GB/match/temporada-2026-2027-laliga-ea-sports-r-racing-club-real-madrid-11",
    note: "Rendez-vous à l’Estadio El Sardinero.",
  },
  {
    leagueId: "premier-league", team: "Manchester City", shortName: "MCI", date: "2026-11-07", time: "17:30 GMT",
    opponent: "Nottingham Forest", opponentShort: "NFO", venue: "Extérieur", competition: "Premier League",
    sourceUrl: "https://www.mancity.com/tickets/mens/nottingham-forest-v-man-city-ticket-information-2627",
    note: "Au City Ground, à Nottingham.",
  },
  {
    leagueId: "premier-league", team: "Arsenal", shortName: "ARS", date: "2026-11-01", time: "16:30 GMT",
    opponent: "Liverpool", opponentShort: "LIV", venue: "Extérieur", competition: "Premier League",
    sourceUrl: "https://www.arsenal.com/ticket-information/ticket-information-liverpool-v-arsenal-a28eN1w0ulce",
    note: "Affiche reprogrammée au dimanche, à Anfield.",
  },
  {
    leagueId: "premier-league", team: "Brighton & Hove Albion", shortName: "BHA", date: "2026-11-08", time: "14:00 GMT",
    opponent: "Brentford", opponentShort: "BRE", venue: "Domicile", competition: "Premier League",
    sourceUrl: "https://www.brightonandhovealbion.com/fixtures-first-team-men",
    note: "À l’American Express Stadium.",
  },
  {
    leagueId: "bundesliga", team: "FC Bayern München", shortName: "FCB", date: "2026-11-07", time: "15:30 CET",
    opponent: "1. FSV Mainz 05", opponentShort: "M05", venue: "Extérieur", competition: "Bundesliga",
    sourceUrl: "https://fcbayern.com/en/matches/profis/bundesliga/2026-2027/1-fsv-mainz-05-fc-bayern-muenchen-07-11-2026/news",
    note: "À la MEWA Arena, à Mayence.",
  },
  {
    leagueId: "bundesliga", team: "Borussia Dortmund", shortName: "BVB", date: "2026-11-07", time: "15:30 CET",
    opponent: "SV Elversberg", opponentShort: "ELV", venue: "Domicile", competition: "Bundesliga · 9e journée",
    sourceUrl: "https://www.bvb.de/de/de/aktuelles/news/news.html/2026/9/10/Bundesliga-Spieltage-5-bis-11-angesetzt-Zwei-Topspiele-fuer-den-BVB.html",
    note: "Prochaine journée de Bundesliga au Signal Iduna Park.",
  },
  {
    leagueId: "bundesliga", team: "Sport-Club Freiburg", shortName: "SCF", date: "2026-11-08", time: "17:30 CET",
    opponent: "1. FC Union Berlin", opponentShort: "FCU", venue: "Domicile", competition: "Bundesliga · 9e journée",
    sourceUrl: "https://www.scfreiburg.com/matchcenter/uebersicht/6a465b2c79763973ad1882e3/2026-Freiburg_-_Union_Berlin",
    note: "À l’Europa-Park Stadion.",
  },
];

export type LeagueFixtures = {
  leagueId: LeagueId;
  events: Match[];
  state: "loading" | "ready" | "unavailable";
};

type EspnTeam = { displayName?: string; name?: string; abbreviation?: string };
type EspnCompetitor = { homeAway: "home" | "away"; team: EspnTeam; score?: string };
type EspnEvent = {
  id: string;
  date: string;
  name?: string;
  competitions?: Array<{
    competitors?: EspnCompetitor[];
    status?: { type?: { name?: string; description?: string; detail?: string; completed?: boolean } };
  }>;
  status?: { type?: { name?: string; description?: string; detail?: string; completed?: boolean } };
};
type EspnResponse = { events?: EspnEvent[] };
type EspnStandingEntry = {
  team?: EspnTeam;
  stats?: Array<{ name?: string; value?: number; displayValue?: string }>;
};
type EspnStandingsResponse = {
  children?: Array<{ standings?: { entries?: EspnStandingEntry[] } }>;
};

function phaseFrom(statusName: string, description: string, completed?: boolean): Match["phase"] {
  const state = `${statusName} ${description}`.toLowerCase();
  if (completed || state.includes("final") || state.includes("full time")) return "finished";
  if (state.includes("progress") || state.includes("live") || state.includes("half")) return "live";
  if (state.includes("scheduled") || state.includes("not started") || state.includes("pre-game")) return "upcoming";
  return "other";
}

function adaptEvent(event: EspnEvent, leagueId: LeagueId): Match | null {
  const competition = event.competitions?.[0];
  const competitors = competition?.competitors ?? [];
  const home = competitors.find((item) => item.homeAway === "home");
  const away = competitors.find((item) => item.homeAway === "away");
  if (!home?.team || !away?.team) return null;

  const status = competition?.status?.type ?? event.status?.type;
  const description = status?.description ?? "À confirmer";
  const statusName = status?.name ?? "";
  return {
    id: event.id,
    leagueId,
    kickoff: event.date,
    home: home.team.displayName ?? home.team.name ?? "Équipe à confirmer",
    away: away.team.displayName ?? away.team.name ?? "Équipe à confirmer",
    homeShort: home.team.abbreviation ?? (home.team.displayName ?? "DOM").slice(0, 3).toUpperCase(),
    awayShort: away.team.abbreviation ?? (away.team.displayName ?? "EXT").slice(0, 3).toUpperCase(),
    homeScore: home.score,
    awayScore: away.score,
    phase: phaseFrom(statusName, description, status?.completed),
    status: status?.detail ?? description,
    source: "ESPN",
  };
}

export function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

export async function fetchStandingsForLeague(league: League, date: Date = new Date()): Promise<Standing[]> {
  const seasonYear = date.getMonth() >= 7 ? date.getFullYear() : date.getFullYear() - 1;
  const url = new URL(`https://site.api.espn.com/apis/v2/sports/soccer/${league.apiCode}/standings`);
  url.searchParams.set("season", String(seasonYear));
  url.searchParams.set("region", "us");
  url.searchParams.set("lang", "en");
  url.searchParams.set("contentorigin", "espn");
  const response = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Classement indisponible (${response.status})`);

  const data = (await response.json()) as EspnStandingsResponse;
  const entries = (data.children ?? []).flatMap((group) => group.standings?.entries ?? []);
  if (entries.length < 10) throw new Error("Le classement reçu est incomplet");

  return entries.map((entry, index) => {
    const stats = entry.stats ?? [];
    const value = (name: string, fallback: number) => {
      const stat = stats.find((item) => item.name === name);
      const parsed = stat?.value ?? Number.parseFloat((stat?.displayValue ?? "").replaceAll(",", "").replace(/^\+/, ""));
      return Number.isFinite(parsed) ? Math.round(parsed) : fallback;
    };
    const team = entry.team;
    return {
      position: value("rank", index + 1) || index + 1,
      shortName: team?.abbreviation ?? (team?.displayName ?? "CLB").slice(0, 3).toUpperCase(),
      team: team?.displayName ?? team?.name ?? "Club",
      played: value("gamesPlayed", 0),
      goalDifference: value("pointDifferential", 0),
      goalsFor: value("pointsFor", 0),
      points: value("points", 0),
    };
  }).sort((a, b) => a.position - b.position);
}

export async function fetchFixturesForLeague(league: League, date: Date): Promise<Match[]> {
  const url = new URL(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league.apiCode}/scoreboard`);
  url.searchParams.set("dates", localDateKey(date));
  url.searchParams.set("limit", "100");
  const response = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Source de calendrier indisponible (${response.status})`);
  const data = (await response.json()) as EspnResponse;
  return (data.events ?? [])
    .map((event) => adaptEvent(event, league.id))
    .filter((event): event is Match => event !== null)
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
}
