import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Form, Container, Button } from "react-bootstrap";
import "../../common/colors.css";
import "./login.css";

function Register() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  return (
    <Container className="d-flex justify-content-center align-items-center">
      <div className="w-50">
        <p className="login-title">Register</p>
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
          <div className="mt-3">
            <Button variant="primary" type="submit" className="">
              Register
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

export default Register;
