import React, { useState } from 'react';
import axios from 'axios';
import  { SkeletonTheme } from 'react-loading-skeleton';
import ReactMarkdown from 'react-markdown';
import '../styles/CodingAssistant.css';

function CodingAssistant() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const fetchAssistantResponse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse('');

    const prompt = `Provide a solution or explanation for the following coding or development question: ${query}`;

    try {
      const apiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAQa4qJBxZDGBdBEwKadVHGJA13OpYR7V4`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        }
      );

      const assistantResponse = apiResponse.data.candidates[0].content.parts[0].text;
      setResponse(assistantResponse);
    } catch (error) {
      console.error('Error fetching response:', error);
      setError('Sorry, something went wrong. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="CodingAssistant">
      <h1>Coding Assistant</h1>
      <form onSubmit={fetchAssistantResponse} className="query-form">
        <textarea
          rows="5"
          cols="50"
          placeholder="Ask your coding or development question here..."
          value={query}
          onChange={handleQueryChange}
          className="query-input"
        />
        <br />
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Loading...' : 'Get Response'}
        </button>
      </form>
      <div className="response-container">
        {loading ? (
          <SkeletonTheme count={5} />
        ) : (
          response && (
            <div className="response">
              <h2>Assistant's Response:</h2>
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          )
        )}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default CodingAssistant;
