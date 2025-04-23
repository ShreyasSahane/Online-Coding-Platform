// import React, { useEffect, useState } from "react";
// import "../styles/ProblemSection.css";
// import "../styles/submission.css";

// const ProblemSection = ({ activeTab }) => {
//   const [problemDetails, setProblemDetails] = useState(null);
//   const [terminalCommand, setTerminalCommand] = useState("");
//   const [submissions, setSubmissions] = useState([]);
//   const [selectedSubmission, setSelectedSubmission] = useState(null);
//   const [latestSuccessfulSubmission, setLatestSuccessfulSubmission] = useState(null);
//   const [solutions, setSolutions] = useState([]);

//   const handleRowClick = (submission) => {
//     setSelectedSubmission(submission);
//   };

//   useEffect(() => {
//     const que_id = localStorage.getItem("que_id");
//     const token = localStorage.getItem("token");

//     if (activeTab === "description" && que_id) {
//       fetchProblemDetails(que_id, token);
//     } else if (activeTab === "submissions" && que_id) {
//       fetchSubmissions(que_id, token);
//     } else if (activeTab === "solution" && que_id) {
//       fetchLatestSuccessfulSubmission(que_id, token);
//     }
//     else if (activeTab === "solution") {
//       fetchSolutions(problemId);
//     }
//   }, [activeTab]);

//   const fetchProblemDetails = async (que_id, token) => {
//     try {
//       const response = await fetch(`http://localhost:8080/problem-details/${que_id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setProblemDetails(data);
//       } else {
//         console.error("Failed to fetch problem details. Status:", response.status);
//       }
//     } catch (error) {
//       console.error("Error fetching problem details:", error);
//     }
//   };

//   const fetchSubmissions = async (que_id, token) => {
//     try {
//       const response = await fetch(`http://localhost:8080/submissions/${que_id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setSubmissions(data);
//       } else {
//         console.error("Failed to fetch submissions. Status:", response.status);
//       }
//     } catch (error) {
//       console.error("Error fetching submissions:", error);
//     }
//   };

//   const fetchLatestSuccessfulSubmission = async (que_id, token) => {
//     try {
//       const response = await fetch(`http://localhost:8080/submissions/${que_id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         const successfulSubmissions = data.filter(submission => submission.status === "pass");
//         if (successfulSubmissions.length > 0) {
//           setLatestSuccessfulSubmission(successfulSubmissions[successfulSubmissions.length - 1]);
//         } else {
//           setLatestSuccessfulSubmission(null);
//         }
//       } else {
//         console.error("Failed to fetch latest successful submission. Status:", response.status);
//       }
//     } catch (error) {
//       console.error("Error fetching latest successful submission:", error);
//     }
//   };

//   const fetchSolutions = async (queId) => {
//     try {
//       const response = await fetch(`http://localhost:8080/solutions/${queId}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = await response.json();

//       if (response.ok) {
//         if (data.message === "No records found") {
//           alert("You must solve the question first to view solutions.");
//         } else {
//           setSolutions(data); // Assuming setSolutions is a state setter for solutions
//         }
//       } else {
//         alert("Failed to fetch solutions");
//       }
//     } catch (error) {
//       console.error("Error fetching solutions:", error);
//       alert("Error fetching solutions");
//     }
//   };


//   if (activeTab === "description") {
//     return (
//       <div className="problem-description active">
//         <h2>{problemDetails?.title || "Problem Title"}</h2>
//         <p>{problemDetails?.description || "Problem description will be shown here."}</p>
//         <p><strong>Tags:</strong> {problemDetails?.tags || "N/A"}</p>
//         <p><strong>Difficulty Level:</strong> {problemDetails?.level || "N/A"}</p>
//         <h3>Test Cases:</h3>
//         <ul>
//           {problemDetails?.test_cases?.length ? problemDetails.test_cases.map((testCase, index) => (
//             <li key={index}>
//               <p><strong>Input:</strong> {testCase.input}</p>
//               <p><strong>Output:</strong> {testCase.output}</p>
//             </li>
//           )) : <p>No test cases available.</p>}
//         </ul>
//       </div>
//     );
//   }

//   if (activeTab === "terminal") {
//     return (
//       <div className="terminal">
//         <textarea
//           value={terminalCommand}
//           onChange={(e) => setTerminalCommand(e.target.value)}
//           placeholder="Write your commands here..."
//           className="terminal-input"
//         ></textarea>
//       </div>
//     );
//   }

//   if (activeTab === "submissions") {
//     return (
//       <div className="submissions-container">
//         <table className="submissions-table">
//           <thead>
//             <tr>
//               <th className="submissions-th">Date</th>
//               <th className="submissions-th">Time</th>
//               <th className="submissions-th">Status</th>
//               <th className="submissions-th">Passed Test Cases</th>
//               <th className="submissions-th">Language</th>
//             </tr>
//           </thead>
//           <tbody>
//             {submissions.map((submission, index) => (
//               <tr key={index} className="submission-row" onClick={() => handleRowClick(submission)}>
//                 <td>{submission.code_date}</td>
//                 <td>{submission.code_time}</td>
//                 <td>{submission.status}</td>
//                 <td>{submission.passed_test_cases}</td>
//                 <td>{submission.language}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {selectedSubmission && (
//           <div className="submission-code">
//             <h3>Submitted Code:</h3>
//             <pre className="code-block">{selectedSubmission.code}</pre>
//           </div>
//         )}
//       </div>
//     );
//   }

//   if (activeTab === "solution") {
//     return (
//       <div className="solutions-container">
//         <table className="solutions-table">
//           <thead>
//             <tr>
//               <th className="solutions-th">Username</th>
//               <th className="solutions-th">Passed Test Cases</th>
//               <th className="solutions-th">Language</th>
//             </tr>
//           </thead>
//           <tbody>
//             {solutions.map((solution, index) => (
//               <tr key={index} className="solution-row" onClick={() => handleRowClick(solution)}>
//                 <td>{solution.username}</td>
//                 <td>{solution.passed_test_cases}</td>
//                 <td>{solution.language}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {selectedSubmission && (
//           <div className="solution-code">
//             <h3>Solution:</h3>
//             <pre className="code-block">{selectedSubmission.code}</pre>
//           </div>
//         )}
//       </div>
//     );
//   }


//   return null;
// };

// export default ProblemSection;


import React, { useEffect, useState } from "react";
import "../styles/ProblemSection.css";
import "../styles/submission.css";

const ProblemSection = ({ activeTab }) => {
  const [problemDetails, setProblemDetails] = useState(null);
  const [terminalCommand, setTerminalCommand] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [solutions, setSolutions] = useState([]);

  const handleRowClick = (submission) => {
    setSelectedSubmission(submission);
  };

  useEffect(() => {
    const que_id = localStorage.getItem("que_id");
    const token = localStorage.getItem("token");

    if (activeTab === "description" && que_id) {
      fetchProblemDetails(que_id, token);
    } else if (activeTab === "submissions" && que_id) {
      fetchSubmissions(que_id, token);
    } else if (activeTab === "solution" && que_id) {
      fetchSolutions(que_id);
    }
  }, [activeTab]);

  const fetchProblemDetails = async (que_id, token) => {
    try {
      const response = await fetch(`http://localhost:8080/problem-details/${que_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProblemDetails(data);
      } else {
        console.error("Failed to fetch problem details. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching problem details:", error);
    }
  };

  const fetchSubmissions = async (que_id, token) => {
    try {
      const response = await fetch(`http://localhost:8080/submissions/${que_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        //const data = await response.json();
       if (data.message === "No records found") {
        <h1>No Submissions yet</h1>
       }
       else
       {
        setSubmissions(data);
       }
          
      } else {
        console.error("Failed to fetch submissions. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const fetchSolutions = async (queId) => {
    try {
      const response = await fetch(`http://localhost:8080/solutions/${queId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      // console.log("Token being sent:", localStorage.getItem('token'));

      if (response.status === 403) {
        //console.log("Unauthorized access. Please log in again.");
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // console.error("Unexpected response type:", await response.text());
        // console.log("Unexpected server response");
        return;
      }

      const data = await response.json();
      if (data.message === "No records found") {
        console.log("You must solve the question first to view solutions.");
      } else {
        setSolutions(data);
      }
    } catch (error) {
      console.error("Error fetching solutions:", error);
      console.log("Error fetching solutions");
    }
  };


  if (activeTab === "solution") {
    return (
      <div className="solutions-container">
        <table className="solutions-table">
          <thead>
            <tr>
              <th className="solutions-th">Username</th>
              <th className="solutions-th">Passed Test Cases</th>
              <th className="solutions-th">Language</th>
            </tr>
          </thead>
          <tbody>
            {solutions.map((solution, index) => (
              <tr key={index} className="solution-row" onClick={() => handleRowClick(solution)}>
                <td>{solution.username}</td>
                <td>{solution.passed_test_cases}</td>
                <td>{solution.language}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedSubmission && (
          <div className="solution-code">
            <h3>Solution:</h3>
            <pre className="code-block">{selectedSubmission.code}</pre>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === "description") {
    return (
      <div className="problem-description active">
        <h2>{problemDetails?.title || "Problem Title"}</h2>
        <p>{problemDetails?.description || "Problem description will be shown here."}</p>
        <p><strong>Tags:</strong> {problemDetails?.tags || "N/A"}</p>
        <p><strong>Difficulty Level:</strong> {problemDetails?.level || "N/A"}</p>
        <h3>Test Cases:</h3>
        <ul>
          {problemDetails?.test_cases?.length ? problemDetails.test_cases.map((testCase, index) => (
            <li key={index}>
              <p><strong>Input:</strong> {testCase.input}</p>
              <p><strong>Output:</strong> {testCase.output}</p>
            </li>
          )) : <p>No test cases available.</p>}
        </ul>
      </div>
    );
  }

  if (activeTab === "terminal") {
    return (
      <div className="terminal">
        <textarea
          value={terminalCommand}
          onChange={(e) => setTerminalCommand(e.target.value)}
          placeholder="Write your commands here..."
          className="terminal-input"
        ></textarea>
      </div>
    );
  }

  if (activeTab === "submissions") {
    return (
      <div className="submissions-container">
        <table className="submissions-table">
          <thead>
            <tr>
              <th className="submissions-th">Date</th>
              <th className="submissions-th">Time</th>
              <th className="submissions-th">Status</th>
              <th className="submissions-th">Passed Test Cases</th>
              <th className="submissions-th">Language</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr key={index} className="submission-row" onClick={() => handleRowClick(submission)}>
                <td>{submission.code_date}</td>
                <td>{submission.code_time}</td>
                <td>{submission.status}</td>
                <td>{submission.passed_test_cases}</td>
                <td>{submission.language}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedSubmission && (
          <div className="submission-code">
            <h3>Submitted Code:</h3>
            <pre className="code-block">{selectedSubmission.code}</pre>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default ProblemSection;
