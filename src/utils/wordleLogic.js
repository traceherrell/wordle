// src/utils/wordleLogic.js
import { WORDS } from "./words";
// Game settings
export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;
export const API_URL = "https://random-word-api.herokuapp.com/word?length=5";

// Function to fetch a random word from the API
export async function fetchRandomWord() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data && data.length > 0 && typeof data[0] === "string") {
      return data[0].toUpperCase(); // Use the first word, convert to uppercase for consistency
    } else {
      throw new Error("Invalid data received from API");
    }
  } catch (error) {
    console.error("Failed to fetch word:", error);
    // Handle errors more gracefully in a real app (e.g., fallback to local word list)
    throw error; // Re-throw to let the calling function handle it
  }
}

export function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  return WORDS[randomIndex].toUpperCase();
}

export function isValidWord(word) {
  return WORDS.includes(word.toLowerCase());
}

// Function to generate Wordle-style feedback for a guess
export function getFeedback(guess, secretWord) {
  const feedback = Array(WORD_LENGTH).fill("absent"); // 'correct', 'present', 'absent'

  // Make copies of the strings for character marking
  const secretLetters = secretWord.split("");
  const guessLetters = guess.split("");

  // First, find the exact matches (correct position)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessLetters[i] === secretLetters[i]) {
      feedback[i] = "correct";
      secretLetters[i] = null; // Mark used letter in secret
      guessLetters[i] = null; // Mark used letter in guess
    }
  }

  // Then, find the present letters (wrong position)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessLetters[i] !== null) {
      // Only process unmarked letters
      const secretIndex = secretLetters.indexOf(guessLetters[i]); // Check unmarked letters in secret
      if (secretIndex !== -1) {
        feedback[i] = "present";
        secretLetters[secretIndex] = null; // Mark used letter in secret
        guessLetters[i] = null; // Mark letter as processed in guess
      }
    }
  }

  return feedback;
}

// Function to determine key status for virtual keyboard coloring
export function getKeyStatuses(guesses) {
  const charStatuses = {}; // 'correct', 'present', 'absent'

  guesses.forEach(({ guess, feedback }) => {
    if (!guess) return; // Skip empty initial guesses if any
    guess.split("").forEach((char, index) => {
      const currentStatus = feedback[index];
      const existingStatus = charStatuses[char];

      // Correct overrides any previous status
      if (currentStatus === "correct") {
        charStatuses[char] = "correct";
      }
      // Present overrides absent, but not correct
      else if (currentStatus === "present" && existingStatus !== "correct") {
        charStatuses[char] = "present";
      }
      // Absent only set if no status exists yet
      else if (currentStatus === "absent" && !existingStatus) {
        charStatuses[char] = "absent";
      }
    });
  });

  return charStatuses;
}

// Basic guess validation (length) - expand this for real-world scenarios
export function isValidGuess(guess) {
  return guess.length === WORD_LENGTH;
}
