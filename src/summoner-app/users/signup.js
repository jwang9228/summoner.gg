import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Container, Button } from "react-bootstrap";
import * as client from "./client";
import "../../common/colors.css";
import "./users.css";

function Signup() {
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const signup = async () => {
    try {
      await client.signup(credentials);
      navigate("/Kanbas/Account");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <div className="w-50">
        <p className="login-title">Sign Up</p>
        <Form className="login-form">
          <Form.Group controlId="email" className="mb-2">
            <Form.Label className="login-label">Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Email"
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="username" className="mb-2">
            <Form.Label className="login-label">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username"
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="password" className="mb-2">
            <Form.Label className="login-label">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
          </Form.Group>
          {error && <div className="error-msg mt-2">{error}</div>}
          <div className="mt-2">
            <Button variant="primary" onClick={signup}>
              Signup
            </Button>
            <Link to="/login" className="btn btn-secondary ms-2">
              Cancel
            </Link>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default Signup;
