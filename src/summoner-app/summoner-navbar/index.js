import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoHomeSharp, IoMenu } from "react-icons/io5";
import { BsBarChartFill } from "react-icons/bs";
import { GiNinjaHead } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";
import { Button } from "react-bootstrap";
import * as client from "../users/client";
import "./nav.css";
import "../../common/colors.css";

function SummonerNav() {
  const links = [
    { text: "Home", icon: IoHomeSharp, route: "#", size: 40 },
    { text: "Stats", icon: BsBarChartFill, route: "stats", size: 40 },
    { text: "Search", icon: FaSearch, route: "search", size: 40 },
    { text: "Profile", icon: GiNinjaHead, route: "profile", size: 40 },
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
          className="img-fluid logo"
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
              {link.text}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
export default SummonerNav;
