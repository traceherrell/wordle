// src/components/Board.js
import React from "react";
import Row from "./Row";
import { MAX_ATTEMPTS, WORD_LENGTH } from "../utils/wordleLogic";
import "./Board.css";

function Board({ guesses, currentGuess, currentAttempt, gameStatus }) {
  const rows = [];
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    let guess = "";
    let feedback = null;

    if (i < currentAttempt) {
      // Past guesses (completed)
      guess = guesses[i] ? guesses[i].guess : "";
      feedback = guesses[i] ? guesses[i].feedback : null;
    } else if (i === currentAttempt) {
      // Current guess (in progress)
      guess = currentGuess;
      feedback = guesses[i] ? guesses[i].feedback : null;
    } else {
      // Future guesses (empty)
      guess = "";
      feedback = null;
    }

    rows.push(<Row key={i} guess={guess} feedback={feedback} />);
  }

  return <div className="board">{rows}</div>;
}

export default Board;
