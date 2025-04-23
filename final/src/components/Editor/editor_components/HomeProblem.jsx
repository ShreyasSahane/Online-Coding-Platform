import React, { useState, useEffect } from "react";
// import "./HomeProblem.css"; // Importing CSS styles

const HomeProblem = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace '/api/problems' with your actual API endpoint
    const fetchProblems = async () => {
      try {
        const response = await fetch("/api/problems");
        if (!response.ok) {
          throw new Error("Failed to fetch problems");
        }
        const data = await response.json();
        setProblems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="outer-home-problem">
    <div className="container-home-problem">
      <h1>Problems</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Difficulty</th>
            <th>Acceptance</th>
            <th>Solution</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem.id}>
              <td>{problem.title}</td>
              <td className={`difficulty-${problem.difficulty.toLowerCase()}`}>
                {problem.difficulty}
              </td>
              <td>{problem.acceptance}</td>
              <td>
                <a href={problem.solution} target="_blank" rel="noreferrer">
                  View Solution
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default HomeProblem;
