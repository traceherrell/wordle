// src/App.js
import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import MessageArea from "./components/MessageArea";
import {
  getRandomWord,
  getFeedback,
  getKeyStatuses,
  isValidGuess,
  MAX_ATTEMPTS,
  WORD_LENGTH,
} from "./utils/wordleLogic";

function App() {
  const [secretWord, setSecretWord] = useState("");
  const [guesses, setGuesses] = useState(
    Array(MAX_ATTEMPTS).fill({ guess: "", feedback: null })
  ); //Pre-fill the array to avoid issues in Board.js
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [gameStatus, setGameStatus] = useState("loading"); // 'loading', 'playing', 'won', 'lost'
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // 'info', 'error', 'success'
  const [keyStatuses, setKeyStatuses] = useState({});

  // Fetch a new word and initialize the game
  const initializeGame = useCallback(async () => {
    setGameStatus("loading");
    setMessage("Fetching new word...");
    setMessageType("info");
    try {
      const word = getRandomWord();
      setSecretWord(word);
      setGuesses(Array(MAX_ATTEMPTS).fill({ guess: "", feedback: null }));
      setCurrentGuess("");
      setCurrentAttempt(0);
      setGameStatus("playing");
      setMessage(`Guess a ${WORD_LENGTH}-letter word.`);
      setMessageType("info");
      setKeyStatuses({});

      console.log("Secret Word (for debugging):", word);
    } catch (error) {
      setGameStatus("error");
      setMessage(`Failed to load word. Please try again later.`);
      setMessageType("error");
    }
  }, []);

  // Load new word on component mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Handle keyboard presses (both physical and virtual)
  const handleKeyPress = useCallback(
    (key) => {
      if (gameStatus !== "playing") return;

      setMessage(""); // Clear previous messages
      setMessageType("info");

      if (key === "Enter") {
        if (currentGuess.length !== WORD_LENGTH) {
          setMessage(`Must be ${WORD_LENGTH} letters.`);
          setMessageType("error");
          return;
        }
        if (!isValidGuess(currentGuess)) {
          //Expand validation logic later (check if it is in word list)
          setMessage("Not a valid word (expansion needed).");
          setMessageType("error");
          return;
        }

        // Process the guess
        let feedback = getFeedback(currentGuess, secretWord);

        console.log(feedback);

        const newGuesses = [...guesses];
        newGuesses[currentAttempt] = { guess: currentGuess, feedback };
        setGuesses(newGuesses);
        setKeyStatuses(getKeyStatuses(newGuesses));

        if (currentGuess === secretWord) {
          setGameStatus("won");
          setMessage(`You won in ${currentAttempt + 1} attempts!`);
          setMessageType("success");
          // setCurrentGuess((prevGuess) => prevGuess + key.toUpperCase());
        } else if (currentAttempt + 1 >= MAX_ATTEMPTS) {
          setGameStatus("lost");
          setMessage(`Out of attempts! The word was ${secretWord}.`);
          setMessageType("error");
        } else {
          setCurrentAttempt((prevAttempt) => prevAttempt + 1);
          setCurrentGuess(""); // Clear guess for the next attempt
        }
      } else if (key === "Backspace") {
        setCurrentGuess((prevGuess) => prevGuess.slice(0, -1));
      } else if (/^[A-Za-z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prevGuess) => prevGuess + key.toUpperCase());
      }
    },
    [currentGuess, currentAttempt, gameStatus, guesses, secretWord]
  );

  // Physical Keyboard Support
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return; // Ignore modifier keys
      const key = event.key;
      if (key === "Enter" || key === "Backspace" || /^[a-zA-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyPress]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Wordle</h1>
      </header>
      <MessageArea message={message} type={messageType} />
      <Board
        guesses={guesses}
        currentGuess={currentGuess}
        currentAttempt={currentAttempt}
        gameStatus={gameStatus}
      />
      {(gameStatus === "won" || gameStatus === "lost") && (
        <button onClick={initializeGame} className="play-again-button">
          Play Again?
        </button>
      )}

      {gameStatus !== "error" && (
        <Keyboard onKeyPress={handleKeyPress} keyStatuses={keyStatuses} />
      )}
    </div>
  );
}

export default App;
