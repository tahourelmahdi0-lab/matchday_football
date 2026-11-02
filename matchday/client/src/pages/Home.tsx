import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  ExternalLink,
  LoaderCircle,
  RefreshCw,
  Trophy,
} from "lucide-react";
import {
  fetchStandingsForLeague,
  fetchFixturesForLeague,
  leagues,
  localDateKey,
  standings,
  upcomingMatches,
  type League,
  type LeagueFixtures,
  type LeagueId,
  type Match,
  type Standing,
  type UpcomingMatch,
} from "@/data/football";
import { canonicalTeamCode, teamLogoPath } from "@/data/teamLogos";

const NAV_LINKS = [
  { label: "Aujourd'hui", href: "#matches" },
  { label: "Les leaders", href: "#upcoming" },
  { label: "Classements", href: "#standings" },
];

function dateLabel(date: Date, options: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat("fr-FR", { ...options, timeZone: undefined }).format(date);
}

type StandingsSource = "snapshot" | "live" | "stale";

function mergeStandings(leagueId: LeagueId, current: Standing[], incoming: Standing[]): Standing[] {
  const currentByCode = new Map(current.map((row) => [canonicalTeamCode(leagueId, row.shortName), row]));
  const merged = incoming.map((row) => {
    const previous = currentByCode.get(canonicalTeamCode(leagueId, row.shortName));
    return previous && row.played < previous.played ? previous : row;
  });
  merged.sort((a, b) => {
    const byPoints = b.points - a.points;
    if (byPoints) return byPoints;
    if (leagueId === "laliga") return a.position - b.position;
    return b.goalDifference - a.goalDifference
      || (b.goalsFor ?? 0) - (a.goalsFor ?? 0)
      || a.position - b.position;
  });
  return merged.map((row, index) => ({ ...row, position: index + 1 }));
}

function isFixtureUpcoming(item: UpcomingMatch, now: Date): boolean {
  const time = item.time.match(/^(\d{1,2}):(\d{2})\s*(CET|CEST|GMT|BST|UTC)$/i);
  if (!time) return item.date.replaceAll("-", "") >= localDateKey(now);
  const [year, month, day] = item.date.split("-").map(Number);
  const zone = time[3].toUpperCase();
  const offsetMinutes = zone === "CET" || zone === "BST" ? 60 : zone === "CEST" ? 120 : 0;
  const kickoff = Date.UTC(year, month - 1, day, Number(time[1]), Number(time[2])) - offsetMinutes * 60_000;
  return kickoff >= now.getTime();
}

function initials(team: string) {
  return team
    .replace(/[.]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function TeamBadge({ leagueId, short, color, small = false }: { leagueId: LeagueId; short: string; color: string; small?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const logo = teamLogoPath(leagueId, short);
  const showLogo = Boolean(logo) && !imageFailed;
  return (
    <span className={`team-badge ${showLogo ? "has-logo" : ""} ${small ? "team-badge-small" : ""}`} style={{ "--club-color": color } as CSSProperties} aria-hidden="true">
      {showLogo ? <img src={logo ?? undefined} alt="" loading="lazy" decoding="async" onError={() => setImageFailed(true)} /> : short.slice(0, 3)}
    </span>
  );
}

function MatchCard({ match, accent }: { match: Match; accent: string }) {
  const time = dateLabel(new Date(match.kickoff), { hour: "2-digit", minute: "2-digit" });
  const isLive = match.phase === "live";
  const isFinished = match.phase === "finished";
  return (
    <article className={`match-card ${isLive ? "match-card-live" : ""}`}>
      <div className="match-card-time">
        <span className={`match-state ${isLive ? "state-live" : isFinished ? "state-finished" : ""}`}>
          {isLive && <i className="live-dot" />}
          {isLive ? match.status : isFinished ? "Terminé" : match.phase === "upcoming" ? time : match.status}
        </span>
      </div>
      <div className="match-sides">
        <div className="match-team match-home">
          <TeamBadge leagueId={match.leagueId} short={match.homeShort} color={accent} />
          <span className="match-team-name">{match.home}</span>
        </div>
        <div className={`score ${isLive ? "score-live" : ""}`} aria-label="Score du match">
          {match.homeScore !== undefined && match.awayScore !== undefined ? (
            <><span>{match.homeScore}</span><span className="score-separator">:</span><span>{match.awayScore}</span></>
          ) : (
            <><span>—</span><span className="score-separator">:</span><span>—</span></>
          )}
        </div>
        <div className="match-team match-away">
          <span className="match-team-name">{match.away}</span>
          <TeamBadge leagueId={match.leagueId} short={match.awayShort} color={accent} />
        </div>
      </div>
      <span className="match-time-mobile">{isLive ? "EN DIRECT" : isFinished ? "TERMINÉ" : time}</span>
      <ArrowUpRight className="match-open-icon" size={15} aria-hidden="true" />
    </article>
  );
}

function LeagueMark({ league }: { league: League }) {
  return <span className="league-mark" style={{ "--league-accent": league.accent } as CSSProperties}>{league.shortName.slice(0, 2)}</span>;
}

function LeagueFixtureBlock({ league, state, events }: { league: League; state: LeagueFixtures["state"]; events: Match[] }) {
  return (
    <section className="league-fixture-block" aria-label={`Matchs de ${league.name}`}>
      <div className="league-fixture-heading">
        <div className="league-heading-main">
          <LeagueMark league={league} />
          <div>
            <h3>{league.name}</h3>
            <span>{league.country} <span className="subtle-dot">·</span> Saison 2026/27</span>
          </div>
        </div>
        <span className="fixture-count">{state === "ready" ? `${events.length} match${events.length > 1 ? "s" : ""}` : state === "loading" ? "Chargement" : "Indisponible"}</span>
      </div>
      {state === "loading" && (
        <div className="fixture-empty"><LoaderCircle size={16} className="spin" /> Chargement des rencontres…</div>
      )}
      {state === "unavailable" && (
        <div className="fixture-empty fixture-error"><span>Les rencontres ne sont pas disponibles pour le moment.</span><a href={league.officialUrl} target="_blank" rel="noreferrer">Calendrier officiel <ArrowUpRight size={14} /></a></div>
      )}
      {state === "ready" && events.length === 0 && (
        <div className="fixture-empty"><span className="empty-mark">—</span> Aucune rencontre programmée aujourd'hui.</div>
      )}
      {state === "ready" && events.length > 0 && events.map((match) => <MatchCard key={match.id} match={match} accent={league.accent} />)}
    </section>
  );
}

function UpcomingCard({ item, league }: { item: (typeof upcomingMatches)[number]; league: League }) {
  const date = item.date ? new Date(`${item.date}T12:00:00`) : null;
  return (
    <article className="upcoming-card">
      <div className="upcoming-card-top">
        <span className="upcoming-league" style={{ "--league-accent": league.accent } as CSSProperties}>{league.shortName}</span>
        <a href={item.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Calendrier officiel de ${item.team}`}><ExternalLink size={14} /></a>
      </div>
      <div className="upcoming-club">
        <TeamBadge leagueId={item.leagueId} short={item.shortName} color={league.accent} />
        <span>{item.team}</span>
      </div>
      <div className="upcoming-matchup"><span className="venue-pill">{item.venue}</span><TeamBadge leagueId={item.leagueId} short={item.opponentShort} color={league.accent} small /><span className="opponent-name">{item.opponent}</span></div>
      <div className="upcoming-date-row"><CalendarDays size={15} /><strong>{date ? dateLabel(date, { weekday: "short", day: "2-digit", month: "short" }) : "Date à confirmer"}</strong>{item.time && <span>{item.time}</span>}</div>
      {item.note && <p className="upcoming-note">{item.note}</p>}
    </article>
  );
}

function UpcomingFallbackCard({ row, league }: { row: Standing; league: League }) {
  return (
    <article className="upcoming-card">
      <div className="upcoming-card-top">
        <span className="upcoming-league" style={{ "--league-accent": league.accent } as CSSProperties}>{league.shortName}</span>
        <a href={league.officialUrl} target="_blank" rel="noreferrer" aria-label={`Calendrier officiel de ${row.team}`}><ExternalLink size={14} /></a>
      </div>
      <div className="upcoming-club">
        <TeamBadge leagueId={league.id} short={row.shortName} color={league.accent} />
        <span>{row.team}</span>
      </div>
      <div className="upcoming-date-row"><CalendarDays size={15} /><strong>Date à confirmer</strong></div>
      <p className="upcoming-note">Consultez le calendrier officiel pour la prochaine affiche.</p>
    </article>
  );
}

function StandingTable({ leagueId, rows, source, updatedAt }: { leagueId: LeagueId; rows: Standing[]; source: StandingsSource; updatedAt: Date | null }) {
  const league = leagues.find((item) => item.id === leagueId)!;
  const updateText = source === "live" && updatedAt
    ? `Données ESPN · ${dateLabel(updatedAt, { hour: "2-digit", minute: "2-digit" })}`
    : source === "stale" && updatedAt
      ? `Dernières données conservées · ${dateLabel(updatedAt, { hour: "2-digit", minute: "2-digit" })}`
      : "Instantané local · 1 nov. 2026";
  return (
    <div className="table-wrap">
      <table className="standings-table">
        <thead>
          <tr><th scope="col">Pos.</th><th scope="col">Club</th><th scope="col" title="Matchs joués">MJ</th><th scope="col" title="Différence de buts">DB</th><th scope="col">Pts</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.position} className={row.position <= 3 ? "leader-row" : ""}>
              <td><span className={`position-number ${row.position === 1 ? "position-first" : ""}`}>{String(row.position).padStart(2, "0")}</span></td>
              <td><div className="table-club"><TeamBadge leagueId={leagueId} short={row.shortName} color={league.accent} /><span>{row.team}</span></div></td>
              <td className="muted-number">{row.played}</td>
              <td className="muted-number">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
              <td><strong className="points-value">{row.points}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-footer"><span>{updateText}</span><a href={league.tableUrl} target="_blank" rel="noreferrer">Tableau officiel <ArrowUpRight size={14} /></a></div>
    </div>
  );
}

export default function Home() {
  const [fixtures, setFixtures] = useState<Record<LeagueId, LeagueFixtures>>(() => ({
    laliga: { leagueId: "laliga", events: [], state: "loading" },
    "premier-league": { leagueId: "premier-league", events: [], state: "loading" },
    bundesliga: { leagueId: "bundesliga", events: [], state: "loading" },
  }));
  const [selectedLeague, setSelectedLeague] = useState<"all" | LeagueId>("all");
  const [standingLeague, setStandingLeague] = useState<LeagueId>("laliga");
  const [currentStandings, setCurrentStandings] = useState<Record<LeagueId, Standing[]>>(standings);
  const [standingsSource, setStandingsSource] = useState<Record<LeagueId, StandingsSource>>({
    laliga: "snapshot",
    "premier-league": "snapshot",
    bundesliga: "snapshot",
  });
  const [standingsUpdatedAt, setStandingsUpdatedAt] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);
  const [today, setToday] = useState(() => new Date());
  const refreshInFlight = useRef(false);

  const refresh = useCallback(async () => {
    if (refreshInFlight.current) return;
    refreshInFlight.current = true;
    setRefreshing(true);
    try {
      const currentDay = new Date();
      setToday(currentDay);
      const [fixtureOutcomes, standingsOutcomes] = await Promise.all([
        Promise.allSettled(leagues.map((league) => fetchFixturesForLeague(league, currentDay))),
        Promise.allSettled(leagues.map((league) => fetchStandingsForLeague(league, currentDay))),
      ]);
      const resultFor = (index: number, leagueId: LeagueId): LeagueFixtures => {
        const result = fixtureOutcomes[index];
        return result.status === "fulfilled"
          ? { leagueId, events: result.value, state: "ready" }
          : { leagueId, events: [], state: "unavailable" };
      };
      setFixtures({
        laliga: resultFor(0, "laliga"),
        "premier-league": resultFor(1, "premier-league"),
        bundesliga: resultFor(2, "bundesliga"),
      });
      setCurrentStandings((current) => {
        const next = { ...current };
        standingsOutcomes.forEach((result, index) => {
          if (result.status === "fulfilled") {
            const leagueId = leagues[index].id;
            next[leagueId] = mergeStandings(leagueId, current[leagueId], result.value);
          }
        });
        return next;
      });
      setStandingsSource((current) => {
        const next = { ...current };
        standingsOutcomes.forEach((result, index) => {
          const leagueId = leagues[index].id;
          next[leagueId] = result.status === "fulfilled" ? "live" : current[leagueId] === "live" ? "stale" : current[leagueId];
        });
        return next;
      });
      if (standingsOutcomes.some((result) => result.status === "fulfilled")) setStandingsUpdatedAt(new Date());
      setRefreshedAt(new Date());
    } finally {
      refreshInFlight.current = false;
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 60_000);
    const midnightCheck = window.setInterval(() => setToday(new Date()), 60_000);
    return () => {
      window.clearInterval(timer);
      window.clearInterval(midnightCheck);
    };
  }, [refresh]);

  const allMatches = useMemo(() => leagues.flatMap((league) => fixtures[league.id]?.events ?? []), [fixtures]);
  const visibleLeagues = selectedLeague === "all" ? leagues : leagues.filter((league) => league.id === selectedLeague);
  const liveCount = allMatches.filter((match) => match.phase === "live").length;
  const completedCount = allMatches.filter((match) => match.phase === "finished").length;
  const dateStamp = dateLabel(today, { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
  const dayKey = localDateKey(today);
  const displayedTime = refreshedAt ? dateLabel(refreshedAt, { hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Matchday, accueil">
          <span className="brand-mark"><span /><span /><span /><span /></span>
          <span className="brand-name">MATCH<span>DAY</span><small>LE FOOT, EN CLAIR</small></span>
        </a>
        <nav className="main-nav" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
        <div className="topbar-right"><span className="season-chip"><span className="season-dot" /> Saison 26/27</span><a className="topbar-time" href="#matches"><Clock3 size={14} /> {dateLabel(today, { hour: "2-digit", minute: "2-digit" })}</a></div>
      </header>

      <section id="top" className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> LE RENDEZ-VOUS FOOTBALL <span className="eyebrow-date">{dateLabel(today, { day: "2-digit", month: "short", year: "numeric" })}</span></div>
          <h1>Le jeu, <span>sans détour.</span></h1>
          <p>Les grands championnats européens réunis dans un seul regard. Scores, classement et prochaines échéances.</p>
          <a className="hero-cta" href="#matches">Suivre la journée <ArrowRight size={16} /></a>
        </div>
        <div className="hero-panel">
          <div className="hero-panel-top"><span className="live-indicator"><i /> CENTRE DE MATCH</span><span className="hero-date">{dateLabel(today, { weekday: "short", day: "2-digit", month: "short" }).toUpperCase()}</span></div>
          <div className="hero-numbers">
            <div><strong>{allMatches.length.toString().padStart(2, "0")}</strong><span>RENCONTRES</span></div>
            <div><strong className={liveCount ? "lime-text" : ""}>{liveCount.toString().padStart(2, "0")}</strong><span>EN DIRECT</span></div>
            <div><strong>{completedCount.toString().padStart(2, "0")}</strong><span>TERMINÉS</span></div>
          </div>
          <div className="hero-panel-bottom"><span><Activity size={14} /> Données de matchs actualisées</span><span>· {displayedTime}</span></div>
          <div className="pitch-lines" aria-hidden="true"><span /><span /><span /></div>
        </div>
      </section>

      <section id="matches" className="matches-section">
        <div className="section-head">
          <div><div className="section-kicker">01 / LE DIRECT</div><h2>La journée <span>du jour</span></h2><p className="section-subtitle">{dateLabel(today, { weekday: "long", day: "numeric", month: "long" })} <span>—</span> horaires affichés dans votre fuseau local</p></div>
          <button className={`refresh-button ${refreshing ? "is-refreshing" : ""}`} type="button" onClick={() => void refresh()} disabled={refreshing}><RefreshCw size={15} /> <span>{refreshing ? "Actualisation…" : "Actualiser"}</span></button>
        </div>
        <div className="match-toolbar">
          <div className="league-tabs" role="tablist" aria-label="Filtrer par championnat">
            <button type="button" role="tab" aria-selected={selectedLeague === "all"} className={selectedLeague === "all" ? "active" : ""} onClick={() => setSelectedLeague("all")}>Tous <span>{allMatches.length}</span></button>
            {leagues.map((league) => (
              <button key={league.id} type="button" role="tab" aria-selected={selectedLeague === league.id} className={selectedLeague === league.id ? "active" : ""} onClick={() => setSelectedLeague(league.id)}><i style={{ "--league-accent": league.accent } as React.CSSProperties} />{league.name}</button>
            ))}
          </div>
          <div className="timezone-label"><Clock3 size={14} /> Heure locale</div>
        </div>
        <div className="fixtures-layout">
          <div className="fixtures-column">
            {visibleLeagues.map((league) => <LeagueFixtureBlock key={league.id} league={league} state={fixtures[league.id].state} events={fixtures[league.id].events} />)}
          </div>
          <aside className="side-rail">
            <div className="spotlight-card">
              <div className="spotlight-heading"><span>À RETENIR</span><Trophy size={16} /></div>
              <p>Trois ligues.<br /><strong>Un seul tableau.</strong></p>
              <div className="spotlight-leagues">{leagues.map((league) => <span key={league.id} style={{ "--league-accent": league.accent } as React.CSSProperties}>{league.shortName}</span>)}</div>
              <a href="#standings">Explorer les classements <ArrowRight size={14} /></a>
            </div>
            <div className="data-note"><span className="note-icon"><Check size={14} /></span><div><strong>Une lecture fiable</strong><p>Scores et classements actualisés chaque minute. Les blasons sont conservés localement.</p></div></div>
            <div className="provider-note"><span>FOURNISSEURS</span><a href="https://www.espn.com/soccer/" target="_blank" rel="noreferrer">Scores & calendriers · ESPN <ExternalLink size={12} /></a></div>
          </aside>
        </div>
      </section>

      <section id="upcoming" className="upcoming-section">
        <div className="section-head upcoming-head">
          <div><div className="section-kicker">02 / LE CALENDRIER</div><h2>Les leaders <span>à suivre</span></h2><p className="section-subtitle">Prochaine échéance des trois premiers de chaque championnat</p></div>
          <span className="leaders-count"><span>09</span> CLUBS DE TÊTE</span>
        </div>
        {upcomingMatches.length ? (
          <div className="upcoming-groups">
            {leagues.map((league) => {
              const leaders = currentStandings[league.id].slice(0, 3);
              const matches = leaders.map((leader) => {
                const code = canonicalTeamCode(league.id, leader.shortName);
                const upcoming = upcomingMatches.find((item) => item.leagueId === league.id && canonicalTeamCode(league.id, item.shortName) === code && isFixtureUpcoming(item, today));
                return { leader, upcoming };
              });
              return <div className="upcoming-group" key={league.id}><div className="upcoming-group-title"><LeagueMark league={league} /><span>{league.name}</span><span className="leader-top3">TOP 3</span></div><div className="upcoming-grid">{matches.map(({ leader, upcoming }) => upcoming ? <UpcomingCard key={`${league.id}-${leader.shortName}`} item={upcoming} league={league} /> : <UpcomingFallbackCard key={`${league.id}-${leader.shortName}`} row={leader} league={league} />)}</div></div>;
            })}
          </div>
        ) : (
          <div className="upcoming-empty"><CalendarDays size={18} /><div><strong>Les calendriers officiels, équipe par équipe</strong><p>Les prochaines dates sont en cours de vérification. Les clubs du top 3 sont calculés à partir des classements ci-dessous.</p></div><span className="coming-soon">MISE À JOUR EN COURS</span></div>
        )}
        <p className="calendar-note"><CalendarDays size={14} /> Les dates et heures publiées sont reprises des calendriers officiels de chaque ligue ou club.</p>
      </section>

      <section id="standings" className="standings-section">
        <div className="section-head standings-head">
          <div><div className="section-kicker">03 / LA HIÉRARCHIE</div><h2>Le classement <span>complet</span></h2><p className="section-subtitle">Toute la saison, club par club — synchronisation automatique chaque minute</p></div>
          <a className="official-link" href={leagues.find((league) => league.id === standingLeague)?.tableUrl} target="_blank" rel="noreferrer">Source officielle <ArrowUpRight size={15} /></a>
        </div>
        <div className="standings-card">
          <div className="standings-card-head">
            <div className="standings-tabs" role="tablist" aria-label="Choisir le classement">
              {leagues.map((league) => <button key={league.id} role="tab" aria-selected={standingLeague === league.id} className={standingLeague === league.id ? "active" : ""} type="button" onClick={() => setStandingLeague(league.id)}><LeagueMark league={league} />{league.name}</button>)}
            </div>
            <span className="standing-round">SAISON 2026 / 27 <ChevronDown size={13} /></span>
          </div>
          <StandingTable leagueId={standingLeague} rows={currentStandings[standingLeague]} source={standingsSource[standingLeague]} updatedAt={standingsUpdatedAt} />
        </div>
        <div className="standings-legend"><span><i className="legend-line legend-champions" /> Top 3 du classement</span><span className="standing-footnote">MJ : matchs joués · DB : différence de buts · Pts : points</span></div>
      </section>

      <footer className="footer">
        <a className="brand brand-footer" href="#top"><span className="brand-mark"><span /><span /><span /><span /></span><span className="brand-name">MATCH<span>DAY</span></span></a>
        <p>Les chiffres du jeu. Rien de plus, tout ce qu'il faut.</p>
        <div className="footer-links">{leagues.map((league) => <a key={league.id} href={league.officialUrl} target="_blank" rel="noreferrer">{league.name} <ArrowUpRight size={12} /></a>)}</div>
        <span className="footer-meta">MATCHDAY · 2026/27 <span>{dayKey.slice(6, 8)} / {dayKey.slice(4, 6)} / {dayKey.slice(0, 4)}</span></span>
      </footer>
    </main>
  );
}
