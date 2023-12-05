import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { GiNinjaHead } from "react-icons/gi";
import { IoSearch, IoHome, IoMenu } from "react-icons/io5";
import { IoIosStats } from "react-icons/io";
import { Button } from "react-bootstrap";
import * as client from "../users/client";
import "./nav.css";
import "../../common/colors.css";

function SummonerNav() {
  const links = [
    { text: "Home", icon: IoHome, route: "#", size: 36 },
    { text: "Stats", icon: IoIosStats, route: "stats", size: 38 },
    { text: "Search", icon: IoSearch, route: "search", size: 36 },
    { text: "Profile", icon: GiNinjaHead, route: "profile", size: 36 },
  ];

  const { pathname } = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const closeMenu = () => {
    setMenuOpen(false);
  };

  const [account, setAccount] = useState(null);
  const fetchAccount = async () => {
    const account = await client.account();
    setAccount(account);
  };
  const signout = async () => {
    closeMenu();
    await client.signout();
  };
  useEffect(() => {
    fetchAccount();
  }, []);

  return (
    <div>
      <div className="top-nav">
        <div className={`menu-button ${menuOpen ? "open" : ""}`}>
          <IoMenu size="30" onClick={toggleMenu} />
        </div>
        <div className="gem-container">
          <img
            className="img-fluid gem"
            src={require("../../images/gem.png")}
            alt="gem logo"
          />
        </div>
        {account ? (
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
      <div className={`list-group side-nav ${menuOpen ? "open" : "closed"}`}>
        <img
          className="img-fluid logo mb-2 mt-1"
          src={require("../../images/logo.png")}
          alt="summoner.gg logo"
        />
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
