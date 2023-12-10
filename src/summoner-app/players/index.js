import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Form, Button } from "react-bootstrap";
import {
  FaTwitter,
  FaTwitch,
  FaYoutube,
  FaInstagram,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { BiTv } from "react-icons/bi";
import * as client from "../users/client";
import "./players.css";

function Players() {
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false);
  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUsers = async () => {
    const users = await client.findAllUsers();
    const sortedUsers = users.sort((a, b) => {
      return a.username.localeCompare(b.username);
    });
    setUsers(sortedUsers);
  };

  const fetchAccount = async () => {
    const account = await client.account();
    setAccount(account);
    setIsAdmin(account && account.role === "Admin");
  };

  const deleteUser = async (user) => {
    if (user._id === account._id) {
      setErrorMessage("You cannot delete your own account");
      return;
    }
    try {
      await client.deleteUser(user);
      setUsers(users.filter((u) => u._id !== user._id));
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("Error deleting user");
    }
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    if (sortOrder === "asc") {
      return valueA < valueB ? -1 : 1;
    } else {
      return valueA > valueB ? -1 : 1;
    }
  });

  useEffect(() => {
    fetchAccount();
    fetchUsers();
  }, []);

  return (
    <div>
      <p className="players-title">Players</p>

      {isAdmin && (
        <div className="text-center">
          <div className="d-flex flex-column align-items-center">
            <Form.Group
              controlId="show-admins"
              className="d-flex justify-content-center pb-1"
            >
              <Form.Check
                className="show-admins-box mb-2 me-2"
                type="checkbox"
                onChange={(e) => setShowAdmins(e.target.checked)}
                checked={showAdmins}
              />
              <Form.Label className="show-admins-label">Show Admins</Form.Label>
            </Form.Group>
          </div>
          <Link to="/create-user" className="btn btn-primary create-btn mb-3">
            Create User
          </Link>
        </div>
      )}

      {errorMessage && (
        <p className="error-msg d-flex justify-content-center">
          {errorMessage}
        </p>
      )}

      <div className="players-table-container">
        <Table hover striped bordered className="players-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("username")} className="sort-col">
                Username
              </th>
              {isAdmin && (
                <th onClick={() => handleSort("email")} className="sort-col email-col">
                  Email
                </th>
              )}
              <th onClick={() => handleSort("role")} className="sort-col">
                Role
              </th>
              <th
                onClick={() => handleSort("position")}
                className={`sort-col ${isAdmin ? "position-col" : ""}`}
              >
                Position
              </th>
              <th className="link-col">Twitter</th>
              <th className="link-col">Twitch</th>
              <th className="link-col">AfreecaTV</th>
              <th className="link-col">Youtube</th>
              <th className="link-col">Instagram</th>
              {isAdmin && <th className="btns-col">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {sortedUsers.map((user) =>
              // user is player
              user.role === "Player" ? (
                <tr key={user._id}>
                  <td>
                    <Link to={`/profile/${user._id}`}>{user.username}</Link>
                  </td>
                  {isAdmin && <td className="email-col">{user.email}</td>}
                  <td>{user.role}</td>
                  <td className={isAdmin ? "position-col" : ""}>
                    {user.position}
                  </td>
                  <td className="link-col">
                    {user.links.Twitter && (
                      <a
                        href={user.links.Twitter}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FaTwitter className="twitter-icon" />
                      </a>
                    )}
                  </td>
                  <td className="link-col">
                    {user.links.Twitch && (
                      <a
                        href={user.links.Twitch}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FaTwitch className="twitch-icon" />
                      </a>
                    )}
                  </td>
                  <td className="link-col">
                    {user.links.AfreecaTV && (
                      <a
                        href={user.links.AfreecaTV}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <BiTv className="aftv-icon" />
                      </a>
                    )}
                  </td>
                  <td className="link-col">
                    {user.links.Youtube && (
                      <a
                        href={user.links.Youtube}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FaYoutube className="youtube-icon" />
                      </a>
                    )}
                  </td>
                  <td className="link-col">
                    {user.links.Instagram && (
                      <a
                        href={user.links.Instagram}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FaInstagram className="instagram-icon" />
                      </a>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="btns-col">
                      <Link
                        to={`/edit-profile/${user._id}`}
                        className="btn btn-primary edit-btn"
                      >
                        <FaEdit />
                      </Link>
                      <Button
                        className="btn-danger delete-btn"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete ${user.username}?`
                            )
                          ) {
                            deleteUser(user);
                          }
                        }}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  )}
                </tr>
              ) : (
                // user is admin and showAdmins is true
                showAdmins &&
                user.role === "Admin" && (
                  <tr key={user._id}>
                    <td>
                      <Link to={`/profile/${user._id}`}>{user.username}</Link>
                    </td>
                    <td className="email-col">{user.email}</td>
                    <td>{user.role}</td>
                    <td className="position-col">{user.position}</td>
                    <td className="link-col">
                      {user.links.Twitter && (
                        <a
                          href={user.links.Twitter}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaTwitter className="twitter-icon" />
                        </a>
                      )}
                    </td>
                    <td className="link-col">
                      {user.links.Twitch && (
                        <a
                          href={user.links.Twitch}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaTwitch className="twitch-icon" />
                        </a>
                      )}
                    </td>
                    <td className="link-col">
                      {user.links.AfreecaTV && (
                        <a
                          href={user.links.AfreecaTV}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <BiTv className="aftv-icon" />
                        </a>
                      )}
                    </td>
                    <td className="link-col">
                      {user.links.Youtube && (
                        <a
                          href={user.links.Youtube}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaYoutube className="youtube-icon" />
                        </a>
                      )}
                    </td>
                    <td className="link-col">
                      {user.links.Instagram && (
                        <a
                          href={user.links.Instagram}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaInstagram className="instagram-icon" />
                        </a>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="btns-col">
                        <Link
                          to={`/edit-profile/${user._id}`}
                          className="btn btn-primary edit-btn"
                        >
                          <FaEdit />
                        </Link>
                        <Button
                          className="btn-danger delete-btn"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete ${user.username}?`
                              )
                            ) {
                              deleteUser(user);
                            }
                          }}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    )}
                  </tr>
                )
              )
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Players;
