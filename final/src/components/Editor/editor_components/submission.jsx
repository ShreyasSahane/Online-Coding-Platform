// submission.jsx
import React, { useEffect, useState } from "react";
import "../styles/Submission.css";

const Submission = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const que_id = localStorage.getItem("que_id");
    fetchSubmissions(que_id);
  }, []);

  const fetchSubmissions = async (que_id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/submissions/${que_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      } else {
        console.error("Failed to fetch submissions. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  return (
    <div className="submissions">
      <h2>Submissions</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Passed Test Cases</th>
          </tr>
        </thead>
        <tbody>
          {submissions.length > 0 ? (
            submissions.map((submission, index) => (
              <tr key={index}>
                <td>{submission.code_date}</td>
                <td>{submission.code_time}</td>
                <td>{submission.status}</td>
                <td>{submission.passed_test_cases}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No submissions found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Submission;