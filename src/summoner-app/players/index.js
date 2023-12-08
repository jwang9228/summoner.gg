import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Form } from "react-bootstrap";
import * as client from "../users/client"
import "./players.css";

function Players() {
  return (
    <div>
      <p className="players-title">Players</p>

      <Table>
        
      </Table>
    </div>
  );
}

export default Players;