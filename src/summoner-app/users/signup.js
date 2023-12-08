import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Container, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { loginUser } from "./userReducer";
import * as utilities from "../../common/utilities"
import * as client from "./client";
import "../../common/colors.css";
import "./users.css";

function Signup() {
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signup = async () => {
    try {
      utilities.checkEmail(credentials.email);
      if (credentials.role === "Admin") {
        credentials.position = "";
      }
      await client.signup(credentials);
      setError("");
      dispatch(loginUser());
      navigate("/profile");
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
    <Container className="d-flex justify-content-center align-items-center">
      <div className="w-50">
        <p className="user-title">Sign Up</p>
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
                setCredentials({ ...credentials, username: e.target.value })
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
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group controlId="role" className="mb-2">
            <Form.Label className="user-label">
              Role <span className="required-red">*</span>
            </Form.Label>
            <Form.Select required onChange={handleRoleChange}>
              <option value="" hidden>
                Select a role
              </option>
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
                  setCredentials({ ...credentials, position: e.target.value })
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
