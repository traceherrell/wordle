// src/components/Keyboard.js
import React from "react";
import "./Keyboard.css";

function Keyboard({ onKeyPress, keyStatuses }) {
  const keysRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
  ];

  const handleClick = (key) => {
    onKeyPress(key);
  };

  return (
    <div className="keyboard">
      {keysRows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            const status = keyStatuses[key] || ""; // 'correct', 'present', 'absent', ''
            const isSpecialKey = key === "Enter" || key === "Backspace";
            const className = `key ${status} ${
              isSpecialKey ? "special-key" : ""
            }`;

            return (
              <button
                key={key}
                className={className}
                onClick={() => handleClick(key)}
              >
                {key === "Backspace" ? "⌫" : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
