import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import SidePanel from "./components/Sidepanel";
import MatchesPage from './components/MatchesPage'; 
import StandingsWidget from './components/StandingsWidget'; 
import AboutUs from './components/AboutUs';
import './App.css';
import Register from './components/Register';
import SignIn from './components/SignIn';
import LeagueOverview from './components/LeagueOverview';
import F1Overview from './components/F1Overview';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLeagueId, setSelectedLeagueId] = useState(null);
  const [selectedLeagueName, setSelectedLeagueName] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  
  const handleSelectLeague = async (league) => {
    const res = await fetch(`https://www.thesportsdb.com/api/v1/json/123/search_all_seasons.php?id=${league.id}`);
    const data = await res.json();
    const latestSeason = data?.seasons?.[0]?.strSeason || '';
  
    setSelectedLeagueId(league.id);
    setSelectedLeagueName(league.name);
    setSelectedSeason(latestSeason);
    setSelectedSport(league.sport);
  };
  
  
  {!selectedLeagueId && <p className="text-center text-gray-500">Select a league to begin</p>}


  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
      <Route
        path="/"
        element={
          <div className="flex">
            <SidePanel onSelectLeague={handleSelectLeague} />
            <div className="flex-grow p-4">
              {!selectedLeagueId ? (
                <p className="text-center text-gray-500">Select a league to begin</p>
              ) : selectedSport === 'Soccer' ? (
                <StandingsWidget
                  leagueId={selectedLeagueId}
                  leagueName={selectedLeagueName}
                  season={selectedSeason}
                />
              ) : selectedSport === 'Motorsport' ? (
                <F1Overview season={2025}
                />
              ) : (
                <LeagueOverview
                  leagueId={selectedLeagueId}
                  leagueName={selectedLeagueName}
                  sport={selectedSport}
                  season={selectedSeason}
                />
              )}
            </div>
          </div>
        }
      />

        <Route
          path="/matches"
          element={
            <div className="flex">
              <SidePanel onSelectLeague={handleSelectLeague} />
              <div className="flex-grow">
                {selectedLeagueId ? (
                  <MatchesPage
                    leagueId={selectedLeagueId}
                    leagueName={selectedLeagueName}
                    season={selectedSeason}
                    sport={selectedSport}
                  />
                ) : (
                  <div className="text-center p-6">Please select a league</div>
                )}
              </div>
            </div>
          }
        />

        <Route path="/about" element={<AboutUs />} />
        <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
      </Routes>

    </Router>
  );
}

export default App;
