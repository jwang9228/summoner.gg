import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Form } from "react-bootstrap";
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
