import React, { useState, useEffect } from "react";
import { Row, Col, Image, Button } from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaTwitter, FaTwitch, FaYoutube, FaInstagram } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import leagueLogo from "../../../images/league-logo.png";
import "./profile.css";
import * as client from "../client";

function Profile() {
  const { id } = useParams();
  const [account, setAccount] = useState(null);

  const fetchAccount = async () => {
    const account = await client.account();
    setAccount(account);
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  const links = ["Twitter", "Twitch", "Youtube", "Instagram"];
  // console.log(account);

  return (
    <div>
      {account ? (
        <div className="ms-5">
          <Row className="basic-info pt-3 pb-3 me-4">
            <Col xs="auto">
              <Image
                src={leagueLogo}
                alt="profile icon"
                className="profile-champ-icon"
                loading="lazy"
              />
            </Col>

            <Col xs="auto">
              <p className="username">{account.username}</p>
              {account.role === "Admin" ? (
                <p className="role">
                  <RiAdminFill title="Admin" className="me-1 mb-1" />
                  {account.role}
                </p>
              ) : (
                <p className="position">
                  Player:{" "}
                  <Image
                    src={require(`../../../data-dragon/role-icons/${account.position}.png`)}
                    alt="profile icon"
                    className="role-icon mb-1"
                    title={`${account.position}`}
                    loading="lazy"
                  />{" "}
                  {account.position}
                </p>
              )}
              <p className="email">{account.email}</p>
              <Link to="/edit-profile" className="btn btn-primary mt-3">
                Edit Profile
              </Link>
            </Col>
          </Row>

          {account.links && (
            <p className="title mt-3 mb-0">
              {links.some((key) => account.links[key]?.trim() !== "") &&
                "Links"}
            </p>
          )}

          {account.links.Twitter && (
            <div className="">
              <FaTwitter className="twitter-icon me-1" />
              <a
                href={account.links.Twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Twitter
              </a>
            </div>
          )}

          {account.links.Twitch && (
            <div className="">
              <FaTwitch className="twitch-icon me-1"/>
              <a
                href={account.links.Twitch}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Twitch
              </a>
            </div>
          )}

          {account.links.Youtube && (
            <div className="">
              <FaYoutube className="youtube-icon me-1"/>
              <a
                href={account.links.Youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Youtube
              </a>
            </div>
          )}

          {account.links.Instagram && (
            <div className="">
              <FaInstagram className="instagram-icon me-1"/>
              <a
                href={account.links.Instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Instagram
              </a>
            </div>
          )}
        </div>
      ) : (
        <p className="user-title">Please login to view your profile</p>
      )}
    </div>
  );
}

export default Profile;
