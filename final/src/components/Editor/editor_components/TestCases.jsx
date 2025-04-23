import React, { useState } from 'react';
import '../styles/TestCases.css';

const TestCases = ({ testCases }) => {
  const [selectedTestCase, setSelectedTestCase] = useState(null); // To track the selected test case
  const [userInput, setUserInput] = useState([]); // For user test case input, now an array
  const [currentParamIndex, setCurrentParamIndex] = useState(0); // Track the current parameter index
  const [numParameters, setNumParameters] = useState(0); // Number of parameters user wants to input

  // Handle clicking a test case
  const handleTestCaseClick = (testCaseIndex) => {
    // Toggle the visibility of the test case details
    if (selectedTestCase === testCaseIndex) {
      setSelectedTestCase(null); // Deselect if the same button is clicked again
    } else {
      setSelectedTestCase(testCaseIndex);
    }
  };

  // Handle input change for user test case
  const handleUserInputChange = (e) => {
    const newUserInput = [...userInput];
    newUserInput[currentParamIndex] = e.target.value;
    setUserInput(newUserInput);
  };

  // Handle number of parameters input change
  const handleNumParametersChange = (e) => {
    const num = parseInt(e.target.value);
    setNumParameters(num);
    setUserInput(Array(num).fill('')); // Initialize array of empty strings based on the number of parameters
    setCurrentParamIndex(0); // Reset the parameter index to 0
  };

  // Handle when the user finishes entering a parameter and moves to the next
  const handleNextParam = () => {
    if (currentParamIndex < numParameters - 1) {
      setCurrentParamIndex(currentParamIndex + 1); // Move to the next parameter
    }
    // You can also handle final submission here after collecting all inputs
    if (currentParamIndex === numParameters - 1) {
      console.log('User Inputs:', userInput);
    }
  };

  // Handle going back to the previous parameter
  const handleBackParam = () => {
    if (currentParamIndex > 0) {
      setCurrentParamIndex(currentParamIndex - 1); // Move to the previous parameter
    }
  };

  return (
    <div className="test-cases">
      <h3>Test Cases</h3>
      <div className="test-case-buttons">
        {testCases.map((testCase, index) => (
          <button
            key={index}
            className={`test-case-button ${
              selectedTestCase === index ? 'active' : ''
            }`}
            onClick={() => handleTestCaseClick(index)} // Toggle on click
          >
            {`Test Case ${index + 1}`}
          </button>
        ))}
        <button
          className={`test-case-button ${
            selectedTestCase === testCases.length ? 'active' : ''
          }`}
          onClick={() => handleTestCaseClick(testCases.length)} // User test case
        >
          User Test Case
        </button>
      </div>

      {selectedTestCase !== null && selectedTestCase < testCases.length && (
        <div className="test-case-details">
          <h4>{`Test Case ${selectedTestCase + 1}`}</h4>
          <p>
            <strong>Input:</strong> {testCases[selectedTestCase].input}
          </p>
          <p>
            <strong>Expected Output:</strong>{' '}
            {testCases[selectedTestCase].expectedOutput}
          </p>
          <p>
            <strong>Actual Output:</strong>{' '}
            {testCases[selectedTestCase].actualOutput}
          </p>
          <p>
            <strong>Result:</strong>{' '}
            <span
              className={`result ${
                testCases[selectedTestCase].result === 'pass' ? 'pass' : 'fail'
              }`}
            >
              {testCases[selectedTestCase].result}
            </span>
          </p>
        </div>
      )}

      {selectedTestCase === testCases.length && (
        <div className="user-test-case">
          <h4>User Test Case</h4>

          {/* Ask the user how many parameters they want to provide */}
          <div className="num-parameters-input">
            <label htmlFor="numParameters">How many parameters?</label>
            <input
              type="number"
              id="numParameters"
              min="1"
              value={numParameters}
              onChange={handleNumParametersChange}
              placeholder="Enter the number of parameters"
            />
          </div>

          {/* Ask for parameters one at a time */}
          {currentParamIndex < numParameters && (
            <div className="user-input-field">
              <label>{`Parameter ${currentParamIndex + 1}`}</label>
              <input
                type="text"
                value={userInput[currentParamIndex] || ''}
                onChange={handleUserInputChange}
                placeholder={`Enter value for parameter ${currentParamIndex + 1}`}
              />
              <div className="buttons">
                {currentParamIndex > 0 && (
                  <button onClick={handleBackParam}>Back</button>
                )}
                <button onClick={handleNextParam}>
                  {currentParamIndex === numParameters - 1 ? 'Submit' : 'Next'}
                </button>
              </div>
            </div>
          )}

          {/* Display the collected user inputs */}
          {currentParamIndex === numParameters && (
            <div className="user-input-summary">
              <h4>Summary of Inputs</h4>
              <ul>
                {userInput.map((input, index) => (
                  <li key={index}>{`Parameter ${index + 1}: ${input}`}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestCases;
