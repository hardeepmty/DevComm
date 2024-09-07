import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CodingChallenge() {
  const [generatingChallenge, setGeneratingChallenge] = useState(false);
  const [challenge, setChallenge] = useState({
    question: "Click 'Get New Challenge' to load a challenge.",
    options: [],
    correctAnswer: "",
    feedback: ""
  });

  useEffect(() => {
    fetchDailyChallenge();
  }, []); 

  const fetchDailyChallenge = async () => {
    setGeneratingChallenge(true);
    setChallenge({
      question: "Loading your challenge... \n It might take a few seconds",
      options: [],
      correctAnswer: "",
      feedback: ""
    });

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAQa4qJBxZDGBdBEwKadVHGJA13OpYR7V4`,
        {
          contents: [
            {
              parts: [
                {
                  text: "Please provide a daily coding challenge or puzzle with four options and the correct answer."
                }
              ]
            }
          ]
        }
      );

      console.log('API Response:', response.data);

      const generatedContent = response.data.candidates[0].content.parts[0].text;
      const formattedContent = processChallengeText(generatedContent);

      console.log('Formatted Challenge Content:', formattedContent);

      setChallenge(formattedContent);
    } catch (error) {
      console.error('Error fetching challenge:', error);
      setChallenge({
        question: "Sorry - Something went wrong. Please try again!",
        options: [],
        correctAnswer: "",
        feedback: ""
      });
    } finally {
      setGeneratingChallenge(false);
    }
  };

  const processChallengeText = (text) => {
    console.log('Processing challenge text:', text);
    const lines = text.split('\n').filter(line => line.trim() !== '');

    let question = '';
    let options = [];
    let correctAnswer = '';

    let isOptionsSection = false;
    let isAnswerSection = false;

    lines.forEach(line => {
      if (line.startsWith('**Coding Challenge:**')) {
        question = line.replace('**Coding Challenge:**', '').trim();
      } else if (line.startsWith('**Options:**')) {
        isOptionsSection = true;
      } else if (line.startsWith('**Correct Answer:**')) {
        isOptionsSection = false;
        isAnswerSection = true;
      } else if (isOptionsSection) {
        if (line.match(/^[a-d]\)/)) {
          options.push(line.replace(/^[a-d]\)/, '').trim());
        }
      } else if (isAnswerSection) {
        correctAnswer = line.replace('**Correct Answer:**', '').trim();
      }
    });

    return {
      question,
      options,
      correctAnswer
    };
  };

  const handleOptionClick = (option) => {
    if (option === challenge.correctAnswer) {
      setChallenge(prev => ({ ...prev, feedback: 'Correct!' }));
    } else {
      setChallenge(prev => ({ ...prev, feedback: 'Incorrect. Try again.' }));
    }
  };

  return (
    <div className="App">
      <h1>Coding Challenge</h1>
      <p>{challenge.question}</p>
      <div className="options">
        {challenge.options.length > 0 ? (
          challenge.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${challenge.feedback === 'Correct!' && option === challenge.correctAnswer ? 'correct' : ''} ${challenge.feedback === 'Incorrect. Try again.' && option !== challenge.correctAnswer ? 'incorrect' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))
        ) : (
          <p>No options available.</p>
        )}
      </div>
      {challenge.feedback && <p className="feedback">{challenge.feedback}</p>}
      <button onClick={fetchDailyChallenge} disabled={generatingChallenge}>
        {generatingChallenge ? "Generating..." : "Get New Challenge"}
      </button>
    </div>
  );
}

export default CodingChallenge;
