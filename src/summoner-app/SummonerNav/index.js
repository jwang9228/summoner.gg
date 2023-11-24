import React from "react";
import { Link, useLocation } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";
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

  return (
    <div className="list-group summoner-nav d-flex flex-column">
      {links.map((link, index) => {
        return (
          <Link
            key={index}
            to={`/${link.route}`}
            className={`list-group-item ${
              pathname.includes(link.route) && "active"
            } summoner-nav-item`}
          >
            <link.icon size={link.size} className="me-3" />
            {link.text}
          </Link>
        );
      })}
    </div>
  );
}
export default SummonerNav;
