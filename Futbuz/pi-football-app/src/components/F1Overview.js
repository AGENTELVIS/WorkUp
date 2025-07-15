import React, { useState } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// F1 API functions
const fetchF1Races = async (season) => {
  console.log(`Fetching F1 race data for season ${season}`);
  
  let allRaces = [];
  
  // Try different approaches to get all races
  const approaches = [      
    `https://api.jolpi.ca/ergast/f1/${season}/results`
  ];
  
  for (const url of approaches) {
    try {
      console.log(`Trying: ${url}`);
      const resultsRes = await fetch(url);
      const resultsData = await resultsRes.json();
      console.log('API Response:', resultsData);
      
      if (resultsData.MRData?.RaceTable?.Races) {
        allRaces = resultsData.MRData.RaceTable.Races;
        console.log(`Found ${allRaces.length} races`);
        break;
      }
    } catch (error) {
      console.log(`Failed with ${url}:`, error);
      continue;
    }
  }
  
  // If we still don't have many races, try fetching race by race
  if (allRaces.length < 10) {
    console.log('Trying to fetch individual races...');
    // Get race schedule first
    const scheduleRes = await fetch(`https://api.jolpi.ca/ergast/f1/${season}/races`);
    const scheduleData = await scheduleRes.json();
    const raceSchedule = scheduleData.MRData?.RaceTable?.Races || [];
    
    console.log(`Race schedule has ${raceSchedule.length} races`);
    
    // Fetch results for each race
    const racePromises = raceSchedule.map(async (race) => {
      try {
        const raceRes = await fetch(`https://api.jolpi.ca/ergast/f1/${season}/${race.round}/results`);
        const raceData = await raceRes.json();
        return raceData.MRData?.RaceTable?.Races?.[0];
      } catch (error) {
        console.log(`Failed to fetch race ${race.round}:`, error);
        return null;
      }
    });
    
    const raceResults = await Promise.all(racePromises);
    allRaces = raceResults.filter(race => race !== null);
    console.log(`Fetched ${allRaces.length} individual race results`);
  }
  
  return allRaces;
};

const fetchDriverStandings = async (season) => {
  console.log(`Fetching driver standings for season ${season}`);
  const response = await fetch(`https://api.jolpi.ca/ergast/f1/${season}/driverstandings`);
  const data = await response.json();
  return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
};

const fetchConstructorStandings = async (season) => {
  console.log(`Fetching constructor standings for season ${season}`);
  const response = await fetch(`https://api.jolpi.ca/ergast/f1/${season}/constructorstandings`);
  const data = await response.json();
  return data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
};

// Custom hooks for F1 data
const useF1Races = (season) => {
  return useQuery({
    queryKey: ['f1-races', season],
    queryFn: () => fetchF1Races(season),
    enabled: !!season,
  });
};

const useDriverStandings = (season) => {
  return useQuery({
    queryKey: ['driver-standings', season],
    queryFn: () => fetchDriverStandings(season),
    enabled: !!season,
  });
};

const useConstructorStandings = (season) => {
  return useQuery({
    queryKey: ['constructor-standings', season],
    queryFn: () => fetchConstructorStandings(season),
    enabled: !!season,
  });
};

// Main component
function F1Overview({ season = 2025, leagueName = "Formula 1" }) {
  const [view, setView] = useState("results");

  // Use React Query hooks
  const { 
    data: seasonsResults = [], 
    isLoading: racesLoading, 
    error: racesError,
    isFetching: racesFetching
  } = useF1Races(season);

  const { 
    data: driverStandings = [], 
    isLoading: driversLoading,
    error: driversError 
  } = useDriverStandings(season);

  const { 
    data: constructorStandings = [], 
    isLoading: constructorsLoading,
    error: constructorsError 
  } = useConstructorStandings(season);

  const loading = racesLoading || driversLoading || constructorsLoading;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">{leagueName} - {season} Season</h2>

      <div className="flex space-x-2 mb-6">
        <button onClick={() => setView("results")} className={tabClass(view === "results")}>
          🏁 Race Results
        </button>
        <button onClick={() => setView("drivers")} className={tabClass(view === "drivers")}>
          🧑‍✈️ Driver Standings
        </button>
        <button onClick={() => setView("constructors")} className={tabClass(view === "constructors")}>
          🏎 Constructors
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading F1 data...</div>
        </div>
      ) : (
        <>
          {/* Debug info with cache status */}
          <div className="mb-4 p-4 bg-gray-100 dark:bg-zinc-800 rounded-lg">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <p>Season: {season}</p>
            <p>Total races found: {seasonsResults.length}</p>
            <p>Driver standings: {driverStandings.length}</p>
            <p>Constructor standings: {constructorStandings.length}</p>
            {seasonsResults.length > 0 && (
              <p>Race dates: {seasonsResults[0]?.date} to {seasonsResults[seasonsResults.length - 1]?.date}</p>
            )}
            {racesFetching && <p className="text-blue-600">🔄 Refetching race data...</p>}
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p>Cache Status: Data cached for 30 minutes, refreshes after 5 minutes</p>
            </div>
          </div>
          
          {/* Error handling */}
          {(racesError || driversError || constructorsError) && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
              <h3 className="font-semibold">Error loading data:</h3>
              {racesError && <p>Races: {racesError.message}</p>}
              {driversError && <p>Drivers: {driversError.message}</p>}
              {constructorsError && <p>Constructors: {constructorsError.message}</p>}
            </div>
          )}
          
          {view === "results" && <RaceResultsTable races={seasonsResults} />}
          {view === "drivers" && <DriverStandingsTable standings={driverStandings} />}
          {view === "constructors" && <ConstructorStandingsTable standings={constructorStandings} />}
        </>
      )}
    </div>
  );
}

// Wrapper component with QueryClientProvider
export default function F1OverviewWithProvider(props) {
  return (
    <QueryClientProvider client={queryClient}>
      <F1Overview {...props} />
    </QueryClientProvider>
  );
}

const tabClass = (active) =>
  `px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
    active
      ? "bg-red-600 text-white shadow-lg"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-100 dark:hover:bg-zinc-700"
  }`;

function RaceResultsTable({ races }) {
  // Safety check for races prop
  if (!races || !Array.isArray(races)) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Loading race data...
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getPositionColor = (position) => {
    switch(position) {
      case "1": return "bg-yellow-400 text-black";
      case "2": return "bg-gray-300 text-black";
      case "3": return "bg-orange-400 text-black";
      default: return "";
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Round</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Grand Prix</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Winner</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Car</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Laps</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Time</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Top 3</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
            {races.map((race, index) => {
              // Safety checks for race object
              if (!race) return null;
              
              const winner = race.Results?.[0];
              const topThree = race.Results?.slice(0, 3) || [];
              const raceKey = race.round || race.raceName || index;
              
              return (
                <tr key={raceKey} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <td className="px-4 py-4 font-medium text-gray-900 dark:text-gray-100">
                    {race.round || "N/A"}
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-gray-900 dark:text-gray-100 font-medium">
                      {race.raceName || "Unknown Race"}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">
                      {race.Circuit?.circuitName || "Unknown Circuit"}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                    {formatDate(race.date)}
                  </td>
                  <td className="px-4 py-4">
                    {winner ? (
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 bg-yellow-400 text-black rounded-full flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          {winner.Driver?.givenName || ""} {winner.Driver?.familyName || "Unknown"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500">TBD</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                    {winner?.Constructor?.name || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                    {winner?.laps || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                    {winner?.Time?.time || winner?.status || "N/A"}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex space-x-1">
                      {topThree.map((result, idx) => {
                        if (!result?.Driver) return null;
                        return (
                          <div key={idx} className="flex items-center space-x-1">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${getPositionColor(result.position)}`}>
                              {result.position}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:inline">
                              {result.Driver.familyName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {races.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No race results available for this season.
        </div>
      )}
    </div>
  );
}

function DriverStandingsTable({ standings }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Position</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Driver</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Constructor</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Points</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Wins</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
            {standings.map((driver) => (
              <tr key={driver.position} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                <td className="px-4 py-4 font-bold text-gray-900 dark:text-gray-100">
                  {driver.position}
                </td>
                <td className="px-4 py-4">
                  <div className="text-gray-900 dark:text-gray-100 font-medium">
                    {driver.Driver.givenName} {driver.Driver.familyName}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">
                    {driver.Driver.nationality}
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                  {driver.Constructors[0]?.name}
                </td>
                <td className="px-4 py-4 font-bold text-gray-900 dark:text-gray-100">
                  {driver.points}
                </td>
                <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                  {driver.wins}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConstructorStandingsTable({ standings }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Position</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Constructor</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Points</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Wins</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
            {standings.map((team) => (
              <tr key={team.position} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                <td className="px-4 py-4 font-bold text-gray-900 dark:text-gray-100">
                  {team.position}
                </td>
                <td className="px-4 py-4">
                  <div className="text-gray-900 dark:text-gray-100 font-medium">
                    {team.Constructor.name}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">
                    {team.Constructor.nationality}
                  </div>
                </td>
                <td className="px-4 py-4 font-bold text-gray-900 dark:text-gray-100">
                  {team.points}
                </td>
                <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                  {team.wins}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}