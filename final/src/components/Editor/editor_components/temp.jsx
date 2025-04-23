import React from 'react';
import CodeEditor from './CodeEditor';
import TestCases from './TestCases';
import CompilationResult from './CompilationResult';
import '../styles/AppContainer.css';

const AppContainer = () => {
  return (
    <div className="app-container">
      {/* Language Selection */}
      <div className="language-selection">
        <select>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c">C</option>
        </select>
      </div>

      {/* Code Editor */}
      <CodeEditor />

      {/* Buttons */}
      <div className="buttons">
        <button>Compile</button>
        <button>Submit Solution</button>
      </div>

      {/* Test Cases */}
      <TestCases />

      {/* Compilation Results */}
      <CompilationResult />
    </div>
  );
};

export default AppContainer;
