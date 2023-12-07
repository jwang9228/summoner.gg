import React, { useState, useEffect } from "react";
import { Row, Col, Image, Button, Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";
import leagueLogo from "../../../images/league-logo.png";
import "../profile/profile.css";
import "./editProfile.css";
import * as client from "../client";

function EditProfile() {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    email: "",
    username: "",
    password: "",
    role: "",
    position: "",
  });
  const [showPosition, setShowPosition] = useState(false);

  const handleRoleChange = (e) => {
    setCredentials({ ...credentials, role: e.target.value });
    setShowPosition(e.target.value === "Player");
  };

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
          <Form>
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
                <Form.Group className="d-flex basic-info-group mt-2">
                  <p className="basic-info-label username-label mb-1 me-2">
                    Username:
                  </p>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    className="basic-info-input"
                    onChange={(e) =>
                      setAccount({ ...account, username: e.target.value })
                    }
                    value={account.username}
                  />
                </Form.Group>

                {account.role === "Admin" ? (
                  <Form.Group className="d-flex basic-info-group mt-2">
                    <Form.Select
                      onChange={handleRoleChange}
                      className="role-position-input me-3"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Player">Player</option>
                    </Form.Select>

                    {showPosition && (
                      <Form.Group className="d-flex basic-info-group">
                        <Form.Select
                          required
                          className="role-position-input"
                          onChange={(e) =>
                            setCredentials({
                              ...credentials,
                              position: e.target.value,
                            })
                          }
                        >
                          <option value="">Select a primary position</option>
                          <option value="Top">Top</option>
                          <option value="Jungle">Jungle</option>
                          <option value="Mid">Mid</option>
                          <option value="Bot">Bot</option>
                          <option value="Support">Support</option>
                          <option value="Fill">Fill</option>
                        </Form.Select>
                      </Form.Group>
                    )}
                  </Form.Group>
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

                <Form.Group className="d-flex basic-info-group mt-2">
                  <p className="basic-info-label email-label mb-1 me-2">
                    Email:
                  </p>
                  <Form.Control
                    type="text"
                    placeholder="Email"
                    className="basic-info-input"
                    onChange={(e) =>
                      setAccount({ ...account, email: e.target.value })
                    }
                    value={account.email}
                  />
                </Form.Group>

                <Form.Group className="d-flex basic-info-group mt-2">
                  <p className="basic-info-label password-label mb-1 me-2">
                    Password:
                  </p>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    className="basic-info-input"
                    onChange={(e) =>
                      setAccount({ ...account, password: e.target.value })
                    }
                    value={account.password}
                  />
                </Form.Group>

                {error && <p className="error-msg d-flex mt-1 mb-0">{error}</p>}
              </Col>
            </Row>

            {/* Links */}
            <Row className="links">
              <Col xs="auto pt-3 pb-3 ms-4 me-4">
                <p className="title"> Links </p>
              </Col>
            </Row>
          </Form>
        </div>
      ) : (
        <p className="user-title">Please login to view your profile</p>
      )}
    </div>
  );
}

export default EditProfile;
