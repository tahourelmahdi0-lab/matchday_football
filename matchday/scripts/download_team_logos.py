#!/usr/bin/env python3
"""Download the 2026/27 club crests from the pinned GitHub repository revision.

The website serves these PNGs locally; it does not fetch logo files from an API.
"""
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen
import json

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "client" / "public" / "team-logos"
REPOSITORY = "https://github.com/luukhopman/football-logos"
REVISION = "2a3978f0b4730645c205d855a4bda54c161183e9"
RAW_ROOT = f"https://raw.githubusercontent.com/luukhopman/football-logos/{REVISION}/logos"

LEAGUES = {
    "laliga": ("Spain - LaLiga", [
        ("BAR", "FC Barcelona.png"), ("ATM", "Atlético de Madrid.png"), ("RMA", "Real Madrid.png"),
        ("BET", "Real Betis Balompié.png"), ("RSO", "Real Sociedad.png"), ("SEV", "Sevilla FC.png"),
        ("ALA", "Deportivo Alavés.png"), ("ATH", "Athletic Bilbao.png"), ("CEL", "Celta de Vigo.png"),
        ("VIL", "Villarreal CF.png"), ("DEP", "Deportivo A Coruña.png"), ("OSA", "CA Osasuna.png"),
        ("RAC", "Racing Santander.png"), ("LEV", "Levante UD.png"), ("ELC", "Elche CF.png"),
        ("RAY", "Rayo Vallecano.png"), ("GET", "Getafe CF.png"), ("ESP", "RCD Espanyol Barcelona.png"),
        ("VAL", "Valencia CF.png"), ("MGA", "Málaga CF.png"),
    ]),
    "premier-league": ("England - Premier League", [
        ("MCI", "Manchester City.png"), ("ARS", "Arsenal FC.png"), ("BHA", "Brighton & Hove Albion.png"),
        ("CHE", "Chelsea FC.png"), ("LIV", "Liverpool FC.png"), ("BRE", "Brentford FC.png"),
        ("BOU", "AFC Bournemouth.png"), ("TOT", "Tottenham Hotspur.png"), ("AVL", "Aston Villa.png"),
        ("HUL", "Hull City.png"), ("LEE", "Leeds United.png"), ("NEW", "Newcastle United.png"),
        ("IPS", "Ipswich Town.png"), ("EVE", "Everton FC.png"), ("FUL", "Fulham FC.png"),
        ("COV", "Coventry City.png"), ("MUN", "Manchester United.png"), ("CRY", "Crystal Palace.png"),
        ("NFO", "Nottingham Forest.png"), ("SUN", "Sunderland AFC.png"),
    ]),
    "bundesliga": ("Germany - Bundesliga", [
        ("FCB", "Bayern Munich.png"), ("BVB", "Borussia Dortmund.png"), ("SCF", "SC Freiburg.png"),
        ("B04", "Bayer 04 Leverkusen.png"), ("ELV", "SV 07 Elversberg.png"), ("RBL", "RB Leipzig.png"),
        ("SVW", "SV Werder Bremen.png"), ("M05", "1.FSV Mainz 05.png"), ("FCA", "FC Augsburg.png"),
        ("TSG", "TSG 1899 Hoffenheim.png"), ("HSV", "Hamburger SV.png"), ("KOE", "1.FC Köln.png"),
        ("SCP", "SC Paderborn 07.png"), ("SGE", "Eintracht Frankfurt.png"), ("VFB", "VfB Stuttgart.png"),
        ("S04", "FC Schalke 04.png"), ("FCU", "1.FC Union Berlin.png"), ("BMG", "Borussia Mönchengladbach.png"),
    ]),
}


def download(item):
    league, folder, code, filename = item
    relative = f"{quote(folder, safe='')}/{quote(filename, safe='')}"
    source = f"{RAW_ROOT}/{relative}"
    request = Request(source, headers={"User-Agent": "Matchday-Local-Team-Crests/1.0"})
    with urlopen(request, timeout=30) as response:
        content = response.read()
    if not content.startswith(b"\x89PNG\r\n\x1a\n"):
        raise ValueError(f"Not a PNG: {source}")
    destination = OUTPUT / league / f"{code.lower()}.png"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(content)
    return {
        "leagueId": league,
        "code": code,
        "file": f"/team-logos/{league}/{code.lower()}.png",
        "source": source,
        "bytes": len(content),
    }


def main():
    items = [(league, folder, code, filename)
             for league, (folder, files) in LEAGUES.items()
             for code, filename in files]
    results = []
    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = [pool.submit(download, item) for item in items]
        for future in as_completed(futures):
            result = future.result()
            results.append(result)
            print(f"{result['leagueId']}/{result['code']}: {result['bytes']} octets")
    results.sort(key=lambda item: (item["leagueId"], item["code"]))
    manifest = {
        "sourceRepository": REPOSITORY,
        "sourceRevision": REVISION,
        "season": "2026/27",
        "logos": results,
    }
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Téléchargés: {len(results)} blasons vers {OUTPUT}")


if __name__ == "__main__":
    main()
