import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Form } from "react-bootstrap";
import {
  FaTwitter,
  FaTwitch,
  FaTv,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import * as client from "../users/client";
import "./players.css";

function Players() {
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false);
  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    fetchAccount();
    fetchUsers();
  }, []);

  return (
    <div>
      <p className="players-title">Players</p>

      {isAdmin && (
        <Form.Group
          controlId="show-admins"
          className="d-flex justify-content-center"
        >
          <Form.Check
            className="show-admins-box mb-2 me-2"
            type="checkbox"
            onChange={(e) => setShowAdmins(e.target.checked)}
            checked={showAdmins}
          />
          <Form.Label className="show-admins-label">Show Admins</Form.Label>
        </Form.Group>
      )}

      <div className="players-table-container">
        <Table hover striped bordered className="players-table">
          <thead>
            <tr>
              <th>Username</th>
              {isAdmin && <th>Email</th>}
              <th>Role</th>
              <th>Position</th>
              <th className="link-col">Twitter</th>
              <th className="link-col">Twitch</th>
              <th className="link-col">AfreecaTV</th>
              <th className="link-col">Youtube</th>
              <th className="link-col">Instagram</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) =>
              user.role === "Player" ? (
                <tr key={user._id}>
                  <td>
                    <Link to={`/profile/${user._id}`}>{user.username}</Link>
                  </td>
                  {isAdmin && <td>{user.email}</td>}
                  <td>{user.role}</td>
                  <td>{user.position}</td>
                  <td className="link-col">
                    {user.links.Twitter && (
                      <a
                        href={user.links.Twitter}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Twitter
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
                        Twitch
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
                        AfreecaTV
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
                        Youtube
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
                        Instagram
                      </a>
                    )}
                  </td>
                </tr>
              ) : (
                showAdmins &&
                user.role === "Admin" && (
                  <tr key={user._id}>
                    <td>
                      <Link to={`/profile/${user._id}`}>{user.username}</Link>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.position}</td>
                    <td className="link-col">
                      {user.links.Twitter && (
                        <a
                          href={user.links.Twitter}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Twitter
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
                          Twitch
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
                          AfreecaTV
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
                          Youtube
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
                          Instagram
                        </a>
                      )}
                    </td>
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
