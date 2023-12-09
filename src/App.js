import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import { useEffect } from "react";
import SummonerApp from "./summoner-app";
import SummonerNav from "./summoner-app/summoner-navbar";
import Summoner from "./summoner-app/summoner";
import Login from "./summoner-app/users/login.js";
import Signup from "./summoner-app/users/signup.js";
import Profile from "./summoner-app/users/profile/profile.js";
import EditProfile from "./summoner-app/users/edit-profile/editProfile.js";
import Players from "./summoner-app/players"
import { Provider } from "react-redux";
import store from "./summoner-app/store/store.js";
import "./common/content.css";
import "./common/colors.css";

function App() {
  useEffect(() => {
    document.body.classList.add("app-background-color");
    return () => {
      document.body.classList.remove("app-background-color");
    };
  }, []);
  return (
    <Provider store={store}>
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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/edit-profile/:id" element={<EditProfile />} />
              <Route path="/players" element={<Players />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </Provider>
  );
}
export default App;
