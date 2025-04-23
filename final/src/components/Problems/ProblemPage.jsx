import React, { useEffect, useState } from "react";
import "../../css/Problems/ProblemPage.css";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination"; // Import Pagination from Bootstrap

const ProblemPage = () => {
  const [problems, setProblems] = useState([]); // Initialize with an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const itemsPerPage = 15; // Number of problems per page

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/problems")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data); // Debugging
        setProblems(data || []); // Ensure `data` is not null
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error); // Debugging
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleProblemClick = (que_id) => {
    localStorage.setItem("que_id", que_id);
    navigate(`/editor`);
  };

  // Calculate current items to display based on the page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProblems = problems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(problems.length / itemsPerPage); // Total pages

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Loading problems...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="pp-outer">
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="./src/images/Dashboard/amd.svg"
              width="30"
              height="30"
            />{" "}
            Bridge2Code
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard">
                Home
              </Nav.Link>
              <Nav.Link href="#problem" active>
                Problems
              </Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="pp-inner">
        <h1 className="text-center">Problems</h1>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Tags</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {currentProblems.map((problem) => (
                <tr
                  key={problem.id}
                  onClick={() => handleProblemClick(problem.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{problem.id}</td>
                  <td>{problem.title}</td>
                  <td>{problem.tags}</td>
                  <td>{problem.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination className="justify-content-center mt-4">
          <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </div>
  );
};

export default ProblemPage;
