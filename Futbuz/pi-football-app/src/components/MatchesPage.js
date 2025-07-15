import React, { useEffect, useState } from 'react';

export default function MatchesPage({ leagueId, leagueName, season }) {
  const [matches, setMatches] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const cacheKey = `matches_${leagueId}_${season}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      setMatches(JSON.parse(cachedData));
    } else {
      const fetchMatches = async () => {
        try {
          const res = await fetch(
            `https://www.thesportsdb.com/api/v1/json/123/eventsseason.php?id=${leagueId}&s=${season}`
          );
          const data = await res.json();
          console.log("Matches response", data);
          setMatches(data.events || []);
          localStorage.setItem(cacheKey, JSON.stringify(data.events || []));
        } catch (err) {
          console.error("Failed to fetch matches", err);
        }
      };
      fetchMatches();
    }
  }, [leagueId, season]);

  const filteredMatches = matches
    .filter((match) => {
      return (
        query.toLowerCase() === "" ||
        match.strHomeTeam?.toLowerCase().includes(query.toLowerCase()) ||
        match.strAwayTeam?.toLowerCase().includes(query.toLowerCase()) ||
        match.strVenue?.toLowerCase().includes(query.toLowerCase())
      );
    })
    .sort((a, b) => new Date(b.dateEvent) - new Date(a.dateEvent));

  return (
    <div className="text-center m-3 p-3 border-2 border-neutral-800 shadow-lg">
      <input
        type="text"
        placeholder="Search teams"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="border-b-2 border-blue-500 mt-1 mb-2 w-2/3 text-center font-semibold outline-none hover:bg-gray-100"
      />
      <ul className="w-full">
        {filteredMatches.map((match) => (
          <li key={match.idEvent} className="border-b-2 border-gray-400 p-3 mb-4">
            <div className="text-base font-bold mb-2">{match.strVenue || 'TBD'}</div>
            <div className="grid grid-cols-3 items-center justify-items-center">
              <div className="flex flex-col items-center">
                <img src={match.strHomeTeamBadge} alt={match.strHomeTeam} className="h-14 w-14 object-contain" />
                <span className="font-semibold text-lg">{match.strHomeTeam}</span>
              </div>

              <div style={{ backgroundColor: '#08142D' }} className="flex justify-center items-center text-white text-lg px-6 py-2 rounded-full shadow-md">
                <span>{match.intHomeScore ?? '-'} - {match.intAwayScore ?? '-'}</span>
              </div>

              <div className="flex flex-col items-center">
                <img src={match.strAwayTeamBadge} alt={match.strAwayTeam} className="h-14 w-14 object-contain" />
                <span className="font-semibold text-lg">{match.strAwayTeam}</span>
              </div>
            </div>

            <div className="mt-2 text-sm font-medium">
              {new Date(match.dateEvent + " " + match.strTime).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
