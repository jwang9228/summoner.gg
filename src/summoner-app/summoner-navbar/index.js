import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GiNinjaHead } from "react-icons/gi";
import { IoHome, IoMenu } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { SiLeagueoflegends } from "react-icons/si";
import { IoIosStats } from "react-icons/io";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../users/userReducer";
import * as client from "../users/client";
import "./nav.css";
import "../../common/colors.css";

function SummonerNav() {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loggedIn = useSelector((state) => state.userReducer.loggedIn);

  const [account, setAccount] = useState(null);
  const fetchAccount = async () => {
    const account = await client.account();
    setAccount(account);
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  const signout = async () => {
    closeMenu();
    await client.signout();
    dispatch(logoutUser());
    setAccount(null);
    navigate("/");
  };

  const links = [
    { text: "Home", icon: IoHome, route: "#", size: 34 },
    { text: "Stats", icon: IoIosStats, route: "stats", size: 36 },
    { text: "Players", icon: FaUserFriends, route: "players", size: 36 },
		{ text: "Teams", icon: SiLeagueoflegends, route: "teams", size: 34 },
    { text: "Profile", icon: GiNinjaHead, route: "profile", size: 34 },
  ];

  const LEAGUE_CURRENT_PATCH = {
    "patch-num": "13.24",
    "patchnotes-link":
      "https://www.leagueoflegends.com/en-pl/news/game-updates/patch-13-24-notes/",
  };

  // one of: '', 'open', 'closed'
  const [menuState, setMenuState] = useState("");
  const toggleMenu = () => {
    setMenuState(menuState === "open" ? "closed" : "open");
  };
  const closeMenu = () => {
    setMenuState("closed");
  };

  return (
    <div>
      <div className="top-nav">
        <div className={`menu-button ${menuState}`}>
          <IoMenu size="30" onClick={toggleMenu} />
        </div>
        <div className="gem-container">
          <img
            className="img-fluid gem"
            src={require("../../images/gem.png")}
            alt="gem logo"
          />
        </div>
        {account || loggedIn ? (
          <Button className="btn btn-primary log-btn" onClick={signout}>
            Logout
          </Button>
        ) : (
          <Link
            className="btn btn-primary log-btn"
            to={"/login"}
            onClick={closeMenu}
          >
            Login
          </Link>
        )}
      </div>
      <div className={`list-group dropdown-menu-anim side-nav ${menuState}`}>
        <img
          className="img-fluid logo mb-2"
          src={require("../../images/logo.png")}
          alt="summoner.gg logo"
        />
        <div className="container patchnotes mt-3 mb-2">
          <img
            className="league-logo"
            src={require("../../images/league-logo.png")}
            alt="league logo"
          />
          <Link
            to={LEAGUE_CURRENT_PATCH["patchnotes-link"]}
            className="patchnotes-link"
            onClick={closeMenu}
          >
            <span className="patchnotes-label ms-2">
              Patch {LEAGUE_CURRENT_PATCH["patch-num"]}
            </span>
          </Link>
        </div>
        {links.map((link, index) => {
          return (
            <Link
              key={index}
              to={`/${link.route}`}
              onClick={closeMenu}
              className={`list-group-item ${
                pathname.includes(link.route) && "active"
              }`}
            >
              <link.icon size={link.size} className="me-3" />
              <span className="navbar-text m-auto">{link.text}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
export default SummonerNav;
