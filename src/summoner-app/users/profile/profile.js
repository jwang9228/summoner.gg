import React, { useState, useEffect } from "react";
import { Row, Col, Image, Button } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { FaTwitter, FaTwitch, FaYoutube, FaInstagram } from "react-icons/fa";
import { BiTv } from "react-icons/bi";
import { RiAdminFill } from "react-icons/ri";
import { IoStarOutline, IoStarSharp } from "react-icons/io5";
import LoginModal from "../../summoner/login-modal";
import leagueLogo from "../../../images/league-logo.png";
import soraka_fire from "../../../images/soraka_fire.png";
import "./profile.css";
import * as client from "../client";

function Profile() {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [favorited, setFavorited] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const getUserFavs = async () => {
    try {
      const user = await client.account();
      setCurrentUser(user);
      if (!user) {
        return;
      }
      const userFavs = user.favoriteUsers.map((fav) => fav.userId.toString());
      setFavorited(userFavs.includes(account._id.toString()));
      setError("");
    } catch (err) {
      console.log(err);
      setError("Error getting user favorites");
    }
  };

  const findUserById = async (id) => {
    try {
      const user = await client.findUserById(id);
      setAccount(user);
      setMessage("");
      if (!user) {
        setMessage("User not found");
        return;
      }
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

  const favoriteUser = async () => {
    if (currentUser) {
      try {
        const user = await client.account();
        setCurrentUser(user);
        await client.addToFavoriteUsers(currentUser._id, account._id);
        setFavorited(true);
      } catch (err) {
        console.log(err);
        setError("Error adding user to favorites");
      }
    } else {
      setShowLoginModal(true);
    }
  };

  const unfavoriteUser = async () => {
    if (currentUser) {
      try {
        const user = await client.account();
        setCurrentUser(user);
        await client.removeFromFavoriteUsers(currentUser._id, account._id);
        setFavorited(false);
      } catch (err) {
        console.log(err);
        setError("Error removing user from favorites");
      }
    }
  };

  useEffect(() => {
    if (id) {
      findUserById(id);
    } else {
      fetchAccount();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getUserFavs();
    }
  }, [account]);

  const links = ["Twitter", "Twitch", "AfreecaTV", "Youtube", "Instagram"];

  return (
    <div>
      {account ? (
        <div className="account-content">
          <Row className="basic-info">
            <Col xs="auto" className="pe-0 ps-0">
              <Image
                src={leagueLogo}
                alt="profile icon"
                className="profile-champ-icon"
                loading="lazy"
              />
            </Col>

            <Col xs="auto" className="basic-info-text p-0">
              <p className="username">
                {account.username}
                {id &&
                  currentUser &&
                  currentUser._id !== account._id &&
                  (favorited ? (
                    <Button
                      variant="transparent"
                      className="fav-btn"
                      onClick={unfavoriteUser}
                    >
                      <IoStarSharp className="fav-star" />
                    </Button>
                  ) : (
                    <Button
                      variant="transparent"
                      className="unfav-btn"
                      onClick={favoriteUser}
                    >
                      <IoStarOutline className="unfav-star" />
                    </Button>
                  ))}
              </p>
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
                <div className="email-edit-container">
                  <p className="email">{account.email}</p>
                  <Link
                    to="/edit-profile"
                    className="btn btn-primary edit-profile-btn"
                  >
                    Edit Profile
                  </Link>
                </div>
              )}
            </Col>
          </Row>

          {error && <div className="error-msg mt-3 mb-0">{error}</div>}

          {account.links && (
            <p className="links-title mt-1 mb-0">
              {links.some((key) => account.links[key]?.trim() !== "") &&
                "Links"}
            </p>
          )}

          {account.links.Twitter && (
            <div>
              <a
                href={account.links.Twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="link twitter-icon"
              >
                <FaTwitter className="me-1"/>
                Twitter
              </a>
            </div>
          )}

          {account.links.Twitch && (
            <div>
              <a
                href={account.links.Twitch}
                target="_blank"
                rel="noopener noreferrer"
                className="link twitch-icon"
              >
                <FaTwitch className="me-1"/>
                Twitch
              </a>
            </div>
          )}

          {account.links.AfreecaTV && (
            <div>
              <a
                href={account.links.AfreecaTV}
                target="_blank"
                rel="noopener noreferrer"
                className="link aftv-icon"
              >
                <BiTv className="me-1"/>
                AfreecaTV
              </a>
            </div>
          )}

          {account.links.Youtube && (
            <div>
              <a
                href={account.links.Youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="link youtube-icon"
              >
                <FaYoutube className="me-1" />
                Youtube
              </a>
            </div>
          )}

          {account.links.Instagram && (
            <div>
              <a
                href={account.links.Instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="link instagram-icon"
              >
                <FaInstagram className="me-1" />
                Instagram
              </a>
            </div>
          )}

          {account.favoriteUsers && account.favoriteUsers.length > 0 && (
            <div>
              <p className="favorites-title mt-2 mb-0">Favorites</p>
              {account.favoriteUsers.map((user, index) => (
                <a
                  key={index}
                  style={{ display: "block", width: "fit-content" }}
                  href={`/profile/${user.userId}`}
                  className="favorite-user-link"
                >
                  {user.username}
                </a>
              ))}
            </div>
          )}

          <LoginModal
            show={showLoginModal}
            onHide={() => setShowLoginModal(false)}
          />
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
