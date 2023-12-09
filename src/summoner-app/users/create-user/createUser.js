import React, { useState, useEffect } from "react";
import { Container, Form, Button, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import teemo_sign from "../../../images/teemo_sign.png";
import * as utilities from "../../../common/utilities";
import "./createUser.css";
import * as client from "../client";

function CreateUser() {
  const [account, setAccount] = useState(null);
  const [accountRole, setAccountRole] = useState(null);
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

  const navigate = useNavigate();

  const fetchAccount = async () => {
    const account = await client.account();
    setAccount(account);
    setAccountRole(account.role);
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  const createUser = async () => {
    try {
      utilities.checkEmail(credentials.email);
      if (credentials.role === "Admin") {
        credentials.position = "";
      }
      await client.createUser(credentials);
      setError("");
      navigate("/players");
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
      {account && accountRole === "Admin" ? (
        <div>
          <Container className="d-flex justify-content-center align-items-center">
            <div className="w-50">
              <p className="user-title">Create User</p>
              <Form className="user-form">
                <Form.Group controlId="email" className="mb-2">
                  <Form.Label className="user-label">
                    Email <span className="required-red">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Email"
                    onChange={(e) =>
                      setCredentials({ ...credentials, email: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group controlId="username" className="mb-2">
                  <Form.Label className="user-label">
                    Username <span className="required-red">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        username: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group controlId="password" className="mb-2">
                  <Form.Label className="user-label">
                    Password <span className="required-red">*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group controlId="role" className="mb-2">
                  <Form.Label className="user-label">
                    Role <span className="required-red">*</span>
                  </Form.Label>
                  <Form.Select required onChange={handleRoleChange}>
                    <option value="">Select a role</option>
                    <option value="Player">Player</option>
                    <option value="Admin">Admin</option>
                  </Form.Select>
                </Form.Group>

                {showPosition && (
                  <Form.Group controlId="primary-position" className="mb-2">
                    <Form.Label className="user-label">
                      Primary Position <span className="required-red">*</span>
                    </Form.Label>
                    <Form.Select
                      required
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

                {error && <div className="error-msg mt-2">{error}</div>}
                <div className="mt-3">
                  <Link to="/players" className="btn btn-secondary">
                    Cancel
                  </Link>
                  <Button className="primary ms-2" onClick={createUser}>
                    Create
                  </Button>
                </div>
              </Form>
            </div>
          </Container>
        </div>
      ) : (
        <div className="text-center">
          <div className="d-flex flex-column align-items-center">
            <p className="profile-msg d-flex justify-content-center">
              You do not have permission to create users
            </p>
          </div>
          <Image
            src={teemo_sign}
            alt="teemo deny"
            className="teemo-sign"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}

export default CreateUser;
