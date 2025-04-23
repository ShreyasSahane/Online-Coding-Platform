import React, { useState, useEffect } from "react";
import TestCases from "./TestCases";
import CodeEditor from "./CodeEditor";
import CompilationResult from "./CompilationResult";
import "../styles/AppContainer.css";

const AppContainer = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [predefinedCode, setPredefinedCode] = useState("");
  const queID = localStorage.getItem("que_id"); // Assuming que_id is stored in localStorage.
  const [testResults, setTestResults] = useState([]);
  const [compilationResult, setCompilationResult] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [passedTestCount, setPassedTestCount] = useState(0);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  useEffect(() => {
    // Fetch predefined code for the question
    const fetchPredefinedCode = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/predefined-code?que_id=${queID}&language=${language}`
        );
        if (response.ok) {
          const data = await response.json();
          setPredefinedCode(data.predefinedCode);
        } else {
          console.error("Failed to fetch predefined code");
        }
      } catch (error) {
        console.error("Error fetching predefined code:", error);
      }
    };

    if (queID) fetchPredefinedCode();
  }, [queID, language]);

  const handleCompile = async () => {
    try {
      const response = await fetch("http://localhost:8080/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          que_id: queID,
          code,
          language,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTestResults(data.testCases);
        setCompilationResult(data.compilationResult);
      } else {
        console.error("Compilation failed");
        setCompilationResult("Compilation failed.");
      }
    } catch (error) {
      console.error("Error during compilation:", error);
      setCompilationResult("Error during compilation.");
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8080/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          que_id: queID,
          code,
          language,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissionStatus(data.status); // "pass" or "fail"
        setPassedTestCount(data.passed_test_cases);
        alert(`Submission ${data.status}! Test cases passed: ${data.passed_test_cases}`);
      } else {
        console.error("Submission failed");
        alert("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("An error occurred during submission. Please try again.");
    }
  };

  return (
    <div className="app-container">
      <div className="language-selection">
        <select value={language} onChange={handleLanguageChange}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c">C</option>
        </select>
      </div>

      <CodeEditor
        language={language}
        value={code}
        onChange={setCode}
        predefinedCode={predefinedCode}
      />

      <div className="buttons">
        <button onClick={handleCompile}>Compile</button>
        <button onClick={handleSubmit}>Submit Solution</button>
      </div>

      <TestCases testCases={testResults} />
      <CompilationResult result={compilationResult} />

      {submissionStatus && (
        <div className={`submission-result ${submissionStatus}`}>
          <p>Status: {submissionStatus.toUpperCase()}</p>
          <p>Test Cases Passed: {passedTestCount}</p>
   
        </div>
      )}
    </div>
  );
};

export default AppContainer;
