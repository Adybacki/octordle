import React, { useState, useEffect } from 'react';
import './App.css';


const App = () => {
  const [targetWord, setTargetWord] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(10);
  const [guessHistory, setGuessHistory] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [matchedLetters, setMatchedLetters] = useState(Array(targetWord.length).fill(false));
  const [inWordLetters, setInWordLetters] = useState(Array(targetWord.length).fill(false));
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
      const fetchWord = async () => {
        const url = 'https://random-word-api.herokuapp.com/word?length=8';
        try {
          const response = await fetch(url);
          const data = await response.json();
          setTargetWord(data[0].toUpperCase());
          console.log(data);
        } catch (error) {
          console.error(error);
        }
      }
    fetchWord();
  }, []);

  useEffect(() => {
    if (attemptsLeft == 0 && !isMatch) {
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
    

      if (userGuess.toUpperCase() === targetWord) {
        setIsMatch(true)
        setFeedback(`Congratulations! You guessed the word "${targetWord}".`);
      }
      
      setAttemptsLeft(attemptsLeft - 1);
      setGuessHistory([...guessHistory, { guess: userGuess}]);
      setUserGuess('');
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
      <form className="textboxInput" onSubmit={handleGuessSubmit}>
        <input
          type="text"
          value={userGuess}
          title="Please input an 8 letter word"
          onInput={handleGuessChange}
          pattern="[A-Za-z]{8}"
          length={8}
          className="guess-input"
          required
          disabled ={attemptsLeft === 0 || isMatch}
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



