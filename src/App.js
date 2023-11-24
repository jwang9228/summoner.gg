// App.jsx or your main component file
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import { useEffect } from "react";
import SummonerApp from "./summoner-app";
import SummonerNav from "./summoner-app/summonernav";
import Summoner from "./summoner";
import "./common/content.css"
import "./common/colors.css";

function App() {
  useEffect(() => {
    document.body.classList.add("app-background-color");
    return () => {
      document.body.classList.remove("app-background-color");
    };
  }, []);
  return (
    <BrowserRouter>
      <div className="d-flex">
        <SummonerNav />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<SummonerApp />} />
            <Route
              path="/results/:server/:summonerName"
              element={<Summoner />}
            />
          </Routes>{" "}
        </div>
      </div>
    </BrowserRouter>
  );
}
export default App;
