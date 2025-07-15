import React,{useEffect,useState} from "react";


  

export default function LeagueOverview({ leagueId, leagueName, sport, season }) {
    const [events, setEvents] = useState([]);

    useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch(`https://www.thesportsdb.com/api/v1/json/123/eventsnextleague.php?id=${leagueId}`);
      const data = await res.json();
      setEvents(data?.events || []);
    };
  
    fetchEvents();
  }, [leagueId]);

    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{leagueName}</h2>
        <p className="text-gray-600">
          Standings are only available for Soccer leagues.
        </p>
        <p>Showing basic info for {sport} instead.</p>
        {/* Optionally fetch and show latest events */}
      </div>
    );
  }
  