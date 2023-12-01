import React, { useState, useEffect } from 'react';
import './App.css';

const generateRandomWord = () => {
  const words = ['mountain', 'bacteria', 'conclude', 'academic', 'baseball', 'concrete', 'accepted', 'bathroom', 'conflict', 'accident', 'becoming'];
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex].toUpperCase();
};

const App = () => {
  const [targetWord, setTargetWord] = useState(generateRandomWord());
  const [userGuess, setUserGuess] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(10);
  const [guessHistory, setGuessHistory] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [matchedLetters, setMatchedLetters] = useState(Array(targetWord.length).fill(false));
  const [inWordLetters, setInWordLetters] = useState(Array(targetWord.length).fill(false));
  const [inputState, setInputState] = useState(false);

  useEffect(() => {
    if (attemptsLeft == 0) {
      setFeedback(`Sorry, you've reached the maximum number of attempts. The correct word was "${targetWord}".`);
      
    }
  }, [attemptsLeft, targetWord]);

  const handleGuessChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, targetWord.length);
    setUserGuess(value);
  };

  const handleGuessSubmit = (e) => {
    e.preventDefault();
   if (userGuess.trim() !== '') {
    
    const newInWordLetters = userGuess.split('').map((letter, index) => letter === targetWord.includes(letter));
    setInWordLetters(newInWordLetters);
    const newMatchedLetters = userGuess.split('').map((letter, index) => letter === targetWord[index]);
    setMatchedLetters(newMatchedLetters);
    

      const isMatch = userGuess.toUpperCase() === targetWord;
      const newFeedback = isMatch ? `Congratulations! You guessed the word "${targetWord}".` : '';

      setAttemptsLeft(attemptsLeft - 1);
      setGuessHistory([...guessHistory, { guess: userGuess}]);
      setUserGuess('');
      setFeedback(newFeedback);
    } 
  };

  return (
    <div className="app-container">
      <h1>Octordle</h1>
      <div className="guess-history">
  <ul>
    {guessHistory.map((item, index) => (
      <li key={index}>
        <strong>
          {item.guess.split('').map((letter, index) => {
            const isMatched = letter === targetWord[index];
            const isInWord = targetWord.includes(letter);
            return (
              <span key={index} className={`letter ${isMatched ? 'matched' : isInWord ? 'in-word' : ''}`}>
                {letter}
              </span>
            );
          })}
        </strong>
      </li>
    ))}
  </ul>
</div>
      <div className="word-display">
        {userGuess.split('').map((letter, index) => (
          <span key={index} className="letter">
            {letter}
          </span>
        ))}
      </div>
      <form onSubmit={handleGuessSubmit}>
        <input
          type="text"
          value={userGuess}
          title="Please input an 8 letter word"
          onInput={handleGuessChange}
          pattern="[A-Za-z]{8}"
          length={8}
          className="guess-input"
          required
          disabled = {attemptsLeft === 0}
        />
        <button type="submit" className="submit-button">
          Submit Guess
        </button>
      </form>
      <div className="feedback">
        <p>{feedback}</p>
      </div>
      <p className="attemptsLeft">Attempts Left: {attemptsLeft}</p>
    </div>
  );
};

export default App;


