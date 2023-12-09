import React, { useState, useEffect } from "react";
import { Row, Col, Image, Button, Form } from "react-bootstrap";
import { useNavigate, Link, useParams } from "react-router-dom";
import leagueLogo from "../../../images/league-logo.png";
import * as utilities from "../../../common/utilities";
import "../profile/profile.css";
import "./editProfile.css";
import * as client from "../client";

function EditProfile() {
  const { id } = useParams();
  const [viewingAccount, setViewingAccount] = useState(null);
  const [viewingAccountRole, setViewingAccountRole] = useState(null);
  const [viewingAccountId, setViewingAccountId] = useState(null);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    role: "",
    position: "",
  });
  const [showPosition, setShowPosition] = useState(false);

  const navigate = useNavigate();

  const findUserById = async (id) => {
    try {
      // user's profile
      const user = await client.findUserById(id);
      setAccount(user);

      // viewing user
      const viewingAccount = await client.account();
      if (!viewingAccount) {
        setError("Please login to view this page");
        return;
      }
      setViewingAccount(viewingAccount);
      setViewingAccountRole(viewingAccount.role);
      setViewingAccountId(viewingAccount._id);
      setError("");
    } catch (err) {
      setError("User not found");
    }
  };

  const handleRoleChange = (e) => {
    setCredentials({ ...credentials, role: e.target.value });
    setAccount({ ...account, role: e.target.value });
    setShowPosition(e.target.value === "Player");
  };

  const fetchAccount = async () => {
    const account = await client.account();
    setAccount(account);
  };

  useEffect(() => {
    if (id) {
      findUserById(id);
    } else {
      fetchAccount();
    }
  }, []);

  const save = async () => {
    try {
      utilities.checkEmail(account.email);
      utilities.checkLinks(account.links);
      if (account.role === "Admin") {
        account.position = "";
      }
      await client.updateUser(account);
      setError("");
      if (viewingAccount) {
        navigate("/players");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const errorMessage = err.response.data.message;
        setError(errorMessage);
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      {account ? (
        viewingAccountRole === "Admin" || viewingAccountId === account._id || !id ? (
          <div className="ms-5">
            <Form>
              {/* Basic Info */}
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
                  {/* Username */}
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

                  {/* Role */}
                  {account.role === "Admin" ? (
                    <Form.Group className="d-flex basic-info-group mt-2">
                      <Form.Select
                        onChange={handleRoleChange}
                        className="role-position-input me-3"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Player">Player</option>
                      </Form.Select>

                      {/* Position */}
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
                            <option value="" hidden>
                              Select a primary position
                            </option>
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
                    <Form.Group className="d-flex basic-info-group mt-2">
                      <p className="basic-info-label player-label m-0">
                        Player:
                      </p>
                      <Form.Select
                        required
                        className="role-position-input"
                        onChange={(e) =>
                          setAccount({
                            ...account,
                            position: e.target.value,
                          })
                        }
                        value={account.position}
                      >
                        <option value="" hidden>
                          Select a primary position
                        </option>
                        <option value="Top">Top</option>
                        <option value="Jungle">Jungle</option>
                        <option value="Mid">Mid</option>
                        <option value="Bot">Bot</option>
                        <option value="Support">Support</option>
                        <option value="Fill">Fill</option>
                      </Form.Select>
                    </Form.Group>
                  )}

                  {/* Email */}
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

                  {/* Password */}
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
                </Col>
              </Row>

              <p className="title pt-3 me-4 mb-1"> Links </p>

              {/* Twitter */}
              <div className="me-4 mb-2">
                <Form.Group className="ps-0">
                  <Form.Label className="link-label mb-1">Twitter</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="Twitter"
                    className="link-input"
                    onChange={(e) =>
                      setAccount({
                        ...account,
                        links: { ...account.links, Twitter: e.target.value },
                      })
                    }
                    value={account.links.Twitter && account.links.Twitter}
                  />
                </Form.Group>
              </div>

              {/* Twitch */}
              <div className="me-4 mb-2">
                <Form.Group className="ps-0">
                  <Form.Label className="link-label mb-1">Twitch</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="Twitch"
                    className="link-input"
                    onChange={(e) =>
                      setAccount({
                        ...account,
                        links: { ...account.links, Twitch: e.target.value },
                      })
                    }
                    value={account.links.Twitch && account.links.Twitch}
                  />
                </Form.Group>
              </div>

              {/* AfreecaTV */}
              <div className="me-4 mb-2">
                <Form.Group className="ps-0">
                  <Form.Label className="link-label mb-1">AfreecaTV</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="AfreecaTV"
                    className="link-input"
                    onChange={(e) =>
                      setAccount({
                        ...account,
                        links: { ...account.links, AfreecaTV: e.target.value },
                      })
                    }
                    value={account.links.AfreecaTV && account.links.AfreecaTV}
                  />
                </Form.Group>
              </div>

              {/* Youtube */}
              <div className="me-4 mb-2">
                <Form.Group className="ps-0">
                  <Form.Label className="link-label mb-1">Youtube</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="Youtube"
                    className="link-input"
                    onChange={(e) =>
                      setAccount({
                        ...account,
                        links: { ...account.links, Youtube: e.target.value },
                      })
                    }
                    value={account.links.Youtube && account.links.Youtube}
                  />
                </Form.Group>
              </div>

              {/* Instagram */}
              <div className="me-4 mb-2">
                <Form.Group className="ps-0">
                  <Form.Label className="link-label mb-1">Instagram</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="Instagram"
                    className="link-input"
                    onChange={(e) =>
                      setAccount({
                        ...account,
                        links: {
                          ...account.links,
                          Instagram: e.target.value,
                        },
                      })
                    }
                    value={account.links.Instagram && account.links.Instagram}
                  />
                </Form.Group>
              </div>

              {/* Error */}
              {error && (
                <p className="error-msg d-flex mt-1 mb-0 ps-0">{error}</p>
              )}

              {/* Buttons */}
              <div className="d-flex">
                <Col xs="auto" className="p-0">
                  <Link
                    to="/profile"
                    className="btn btn-secondary mt-2 mb-3 me-2"
                  >
                    Cancel
                  </Link>
                </Col>
                <Col xs="auto" className="p-0">
                  <Button
                    variant="primary"
                    className="btn-primary save-btn mt-2 mb-3"
                    onClick={save}
                  >
                    Save
                  </Button>
                </Col>
              </div>
            </Form>
          </div>
        ) : (
          <p className="profile-msg">
            You do not have permission to edit this profile
          </p>
        )
      ) : (
        <p className="profile-msg">User not found</p>
      )}
    </div>
  );
}

export default EditProfile;
