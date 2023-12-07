import React, { useState, useEffect } from "react";
import { Row, Col, Image, Button } from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
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
  return (
    <div>
      {account ? (
        <div className="ms-2">
          <Row className="basic-info pt-3 pb-3 ms-4 me-4">
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
          <Row className="links">
            <Col xs="auto pt-3 pb-3 ms-4 me-4">
              <p className="title"> Links </p>
            </Col>
          </Row>
        </div>
      ) : (
        <p className="user-title">Please login to view your profile</p>
      )}
    </div>
  );
}

export default Profile;
