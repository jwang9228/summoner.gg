import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Container, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { loginUser } from "./userReducer";
import * as client from "./client";
import "../../common/colors.css";
import "./users.css";

function Login() {
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const signin = async () => {
    try {
      await client.signin(credentials);
      setError("");
      dispatch(loginUser());
      navigate("/profile");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <div className="w-50">
        <p className="user-title">Login</p>
        <Form className="user-form">
          <Form.Group controlId="username" className="mb-2">
            <Form.Label className="user-label">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username"
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="password" className="mb-2">
            <Form.Label className="user-label">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
          </Form.Group>
          <Form.Text className="user-label">
            Don't have an account? <Link to="/register">Sign up here</Link>
          </Form.Text>
          <br />
          {error && <div className="error-msg mt-2">{error}</div>}
          <Button variant="primary" onClick={signin} className="mt-2">
            Login
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default Login;
