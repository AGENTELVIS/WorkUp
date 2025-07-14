import React, { useEffect, useState } from 'react';

export default function StandingsPage({ leagueId, leagueName, season }) {

  const fetchValidSeason = async (leagueId) => {
    const res = await fetch(`https://www.thesportsdb.com/api/v1/json/123/search_all_seasons.php?id=${leagueId}`);
    const data = await res.json();
    const availableSeasons = data.seasons?.map(s => s.strSeason) || [];
  
    // Return latest season (sort descending)
    return availableSeasons.sort().reverse()[0]; 
  };
  
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const validSeason = season || await fetchValidSeason(leagueId);
      if (!validSeason) return;
  
      const cacheKey = `standings_${leagueId}_${validSeason}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setStandings(JSON.parse(cached));
        return;
      }
  
      try {
        const res = await fetch(`https://www.thesportsdb.com/api/v1/json/123/lookuptable.php?l=${leagueId}&s=${validSeason}`);
        const data = await res.json();
        const table = data.table || [];
        setStandings(table);
        localStorage.setItem(cacheKey, JSON.stringify(table));
      } catch (e) {
        console.error("Failed to fetch standings", e);
      }
    };
  
    loadData();
  }, [leagueId, season]);
  
  return (
    <div className="flex flex-grow justify-center items-center">
      <div className="border-2 border-neutral-800 m-3 p-5 shadow-lg w-full">
        <h2 className="text-center text-xl font-bold mb-4">{leagueName} Standings</h2>
        <table className="table-auto w-full border-collapse border border-gray-500">
          <thead className="bg-gray-200 text-center">
            <tr>
              <th className="p-2">Rank</th>
              <th className="p-2">Team</th>
              <th className="p-2">Played</th>
              <th className="p-2">Win</th>
              <th className="p-2">Draw</th>
              <th className="p-2">Loss</th>
              <th className="p-2">Goals</th>
              <th className="p-2">Points</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr key={index} className="text-center">
                <td className="p-2">{team.intRank}</td>
                <td className="p-2 text-left flex items-center">
                  <img src={team.strTeamBadge} alt={team.strTeam} className="h-6 w-6 mr-2" />
                  {team.strTeam}
                </td>
                <td className="p-2">{team.intPlayed}</td>
                <td className="p-2">{team.intWin}</td>
                <td className="p-2">{team.intDraw}</td>
                <td className="p-2">{team.intLoss}</td>
                <td className="p-2">{team.intGoalsFor}-{team.intGoalsAgainst}</td>
                <td className="p-2">{team.intPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
