import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoHomeSharp, IoMenu } from "react-icons/io5";
import { BsBarChartFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import "./nav.css";
import "../../common/colors.css";

function SummonerNav() {
  const links = [
    { text: "Home", icon: IoHomeSharp, route: "#", size: 40 },
    { text: "Stats", icon: BsBarChartFill, route: "stats", size: 40 },
    { text: "Search", icon: FaSearch, route: "search", size: 40 },
  ];

  const { pathname } = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

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
        <Link
          className="btn btn-primary login-btn"
          to={"/login"}
          onClick={closeMenu}
        >
          Login
        </Link>
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
