import React from 'react';

const leaguesBySport = {
  Soccer: [
    { id: "4328", name: "Premier League", season: "2021-2022" },
    { id: "4332", name: "Serie A", season: "2021-2022" },
    { id: "4331", name: "Bundesliga", season: "2021-2022" },
    { id: "4335", name: "La Liga", season: "2021-2022" },
    { id: "4334", name: "Ligue 1", season: "2021-2022" },         // ✅ France
  ],
  Motorsport: [
    { id: "4370", name: "Formula 1" },
  ],
  Basketball: [
    { id: "4387", name: "NBA" },
  ],
  Tennis: [
    { id: "4424", name: "ATP World Tour Finals" },
  ],
};

export default function SidePanel({ onSelectLeague }) {
  return (
    <aside className="h-[80vh] overflow-y-auto w-full sm:w-1/5 m-3 shadow-xl border-2 border-neutral-800 rounded-xl bg-white dark:bg-zinc-900">
      <nav className="px-2 py-3">
        <p className="font-bold text-center mb-3 text-lg">Leagues</p>
        <hr className="border-neutral-800 mb-3" />

        {Object.entries(leaguesBySport).map(([sport, leagues]) => (
          <div key={sport} className="mb-4">
            <h3 className="text-md font-semibold text-blue-700 dark:text-blue-300 pl-2">{sport}</h3>
            <ul>
              {leagues.map((league) => (
                <li
                  key={league.id}
                  onClick={() =>
                    onSelectLeague({
                      id: league.id,
                      name: league.name,
                      season: '', // optional: fetch via `search_all_seasons.php`
                      sport,
                    })
                  }
                  className="flex items-center gap-2 p-2 pl-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  <span className="text-sm">{league.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
