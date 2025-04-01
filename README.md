# Wordle

A web-based version of the popular word-guessing game Wordle.

## How to Play

1. The goal is to guess a 5-letter word in 6 attempts or fewer.
2. Type a 5-letter word and press Enter to submit your guess.
3. After each guess, the color of the tiles will change:
   - Green: The letter is correct and in the right position.
   - Yellow: The letter is in the word but in the wrong position.
   - Gray: The letter is not in the word.
4. Use the information from your previous guesses to help figure out the word.
5. You win when all letters are in the correct position (all green).

## Setup

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```