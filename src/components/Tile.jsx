// src/components/Tile.js
import React from "react";
import "./Tile.css";

function Tile({ letter, status }) {
  return <div className={`tile ${status || "empty"}`}>{letter}</div>;
}

export default Tile;
