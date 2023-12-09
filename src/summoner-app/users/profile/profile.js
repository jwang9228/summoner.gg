import React, { useState, useEffect } from "react";
import { Row, Col, Image } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { FaTwitter, FaTwitch, FaYoutube, FaInstagram } from "react-icons/fa";
import { BiTv } from "react-icons/bi";
import { RiAdminFill } from "react-icons/ri";
import ff20 from "../../../images/ff20.png";
import leagueLogo from "../../../images/league-logo.png";
import soraka_fire from "../../../images/soraka_fire.png";
import "./profile.css";
import * as client from "../client";

function Profile() {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [message, setMessage] = useState("");

  const findUserById = async (id) => {
    try {
      const user = await client.findUserById(id);
      setAccount(user);
      setMessage("");
    } catch (err) {
      setMessage("User not found");
    }
  };

  const fetchAccount = async () => {
    const account = await client.account();
    setAccount(account);
    if (!account) {
      setMessage("Please login to view your profile");
    } else {
      setMessage("");
    }
  };

  useEffect(() => {
    if (id) {
      findUserById(id);
    } else {
      fetchAccount();
    }
  }, [id]);

  const links = ["Twitter", "Twitch", "AfreecaTV", "Youtube", "Instagram"];
  // const socialMedia = [
  //   { url: account.links.Twitter, icon: <FaTwitter className="twitter-icon me-1" />, text: "Twitter" },
  //   { url: account.links.Twitch, icon: <FaTwitch className="twitch-icon me-1" />, text: "Twitch" },
  //   { url: account.links.AfreecaTV, icon: <BiTv className="aftv-icon me-1" />, text: "AfreecaTV" },
  //   { url: account.links.Youtube, icon: <FaYoutube className="youtube-icon me-1" />, text: "Youtube" },
  //   { url: account.links.Instagram, icon: <FaInstagram className="instagram-icon me-1" />, text: "Instagram" },
  // ]

  return (
    <div>
      {account ? (
        <div className="ms-5">
          <Row className="basic-info pt-4 pb-4 me-4">
            <Col xs="auto" className="pe-0 ps-0">
              <Image
                src={leagueLogo}
                alt="profile icon"
                className="profile-champ-icon"
                loading="lazy"
              />
            </Col>

            <Col xs="auto" className="basic-info-text p-0">
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
              {!id && (
                <div>
                  <p className="email">{account.email}</p>
                  <Link to="/edit-profile" className="btn btn-primary mt-3">
                    Edit Profile
                  </Link>
                </div>
              )}
            </Col>
          </Row>

          {account.links && (
            <p className="title mt-3 mb-0">
              {links.some((key) => account.links[key]?.trim() !== "") &&
                "Links"}
            </p>
          )}

          {account.links.Twitter && (
            <div>
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
            <div>
              <FaTwitch className="twitch-icon me-1" />
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

          {account.links.AfreecaTV && (
            <div>
              <BiTv className="aftv-icon me-1" />
              <a
                href={account.links.AfreecaTV}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                AfreecaTV
              </a>
            </div>
          )}

          {account.links.Youtube && (
            <div>
              <FaYoutube className="youtube-icon me-1" />
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
            <div>
              <FaInstagram className="instagram-icon me-1" />
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
        <div className="text-center">
          <div className="d-flex flex-column align-items-center">
            <p className="profile-msg d-flex justify-content-center">
              {message}
            </p>
          </div>
          <Image
            src={soraka_fire}
            alt="soraka everything is fine"
            className="soraka_fire"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}

export default Profile;
