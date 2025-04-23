import React, { useState, useEffect } from 'react';
import { Navbar, Container, Table, Button, Modal, Nav, NavDropdown, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import amd from '../../images/Dashboard/amd.svg';
import '../../css/Dashboard/Dashboard1.css';

function ProblemSubmission() {
    const [submissions, setSubmissions] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await fetch("http://localhost:8080/get-submissions?que_id=" + localStorage.getItem("que_id"));
                if (response.ok) {
                    const data = await response.json();
    
                    // Check if the response is an array or not
                    if (Array.isArray(data)) {
                        setSubmissions(data);
                    } else {
                        setSubmissions([]);  // Set empty array if no records found
                        console.warn(data.message || "Unexpected response format");
                    }
                } else {
                    console.error("Failed to fetch submissions");
                    setSubmissions([]);  // Ensure it's an empty array on failure
                }
            } catch (error) {
                console.error("Error fetching submissions:", error);
                setSubmissions([]);  // Ensure it's an empty array on error
            }
        };
    
        fetchSubmissions();
    }, []);
    

    const handleRowClick = (submission) => {
        setSelectedSubmission(submission);
        setShowModal(true);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = submissions.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(submissions.length / itemsPerPage);

    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                <Container>
                    <Navbar.Brand href="#home">
                        <img alt="" src={amd} width="30" height="30" />
                        {' '} Bridge2Code
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/admin-problems">Problems</Nav.Link>
                            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="container mt-4">
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Passed Test Cases</th>
                            <th>Status</th>
                            <th>Submission Date & Time</th>
                            <th>Language</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((submission, index) => (
                            <tr key={index} onClick={() => handleRowClick(submission)}>
                                <td>{submission.user_id}</td>
                                <td>{submission.username}</td>
                                <td>{submission.passed_test_cases}</td>
                                <td>{submission.status}</td>
                                <td>{submission.submission_time}</td>
                                <td>{submission.language}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination className="justify-content-center mt-4">
                    <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {Array.from({ length: totalPages }, (_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Submitted Code</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <pre className="bg-light p-3 rounded" style={{ height: '400px', overflowY: 'auto' }}>{selectedSubmission?.code}</pre>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ProblemSubmission;
