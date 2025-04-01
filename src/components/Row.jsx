// src/components/Row.js
import React from "react";
import Tile from "./Tile";
import { WORD_LENGTH } from "../utils/wordleLogic";
import "./Row.css";

function Row({ guess, feedback }) {
  const tiles = [];
  for (let i = 0; i < WORD_LENGTH; i++) {
    const letter = guess ? guess[i] || "" : ""; // Show letter or be empty
    const status = feedback ? feedback[i] : "empty"; // Status from feedback

    tiles.push(<Tile key={i} letter={letter} status={status} />);
  }

  return <div className="row">{tiles}</div>;
}

export default Row;
