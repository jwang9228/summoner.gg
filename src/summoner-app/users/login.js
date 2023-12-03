import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Container, Button } from "react-bootstrap";
import "../../common/colors.css";
import "./users.css";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  return (
    <Container className="d-flex justify-content-center align-items-center">
      <div className="w-50">
        <p className="login-title">Login</p>
        <Form className="login-form">
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
          <Form.Text className="login-label">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </Form.Text>
          <br />
          <Button variant="primary" type="submit" className="mt-2">
            Login
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default Login;
