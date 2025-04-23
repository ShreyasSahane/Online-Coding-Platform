import React, { useEffect, useState } from "react";
import "../../css/Problems/ProblemPage.css";
import {
    Navbar,
    Nav,
    NavDropdown,
    Container,
    Modal,
    Button,
    Form,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import amd from '../../images/Dashboard/amd.svg';

const ProblemsHandling = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editProblem, setEditProblem] = useState(null);
    const [newProblem, setNewProblem] = useState({
        title: "",
        description: "",
        tags: "",
        level: "easy",
        que_predefined_code_java: "",
        que_predefined_code_js: "",
        que_predefined_code_c: "",
        que_predefined_code_python: "",
    });

    const itemsPerPage = 5;
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
                setProblems(data || []);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const handleProblemClick = (que_id) => {
        localStorage.setItem("que_id", que_id);
        navigate(`/get-submissions`);
    };

    const fetchProblems = () => {
        fetch("http://localhost:8080/problems") // Replace with your API endpoint
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch problems");
                }
                return response.json();
            })
            .then((data) => {
                setProblems(data); // Update the problems state with the latest data
            })
            .catch((error) => {
                console.error("Error fetching problems:", error);
            });
    };

    const handleEdit = (problem) => {
        setEditProblem({
            ...problem,
            description: problem.description || "",
            tags: problem.tags || "",
            que_predefined_code_java: problem.que_predefined_code_java || "",
            que_predefined_code_js: problem.que_predefined_code_js || "",
            que_predefined_code_c: problem.que_predefined_code_c || "",
            que_predefined_code_python: problem.que_predefined_code_python || "",
        });
        setShowEditModal(true);
    };

    const handleDelete = (problemId) => {
        if (window.confirm("Are you sure you want to delete this problem?")) {
            fetch(`http://localhost:8080/problems/${problemId}`, {
                method: "DELETE",
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to delete problem");
                    }
                    setProblems(problems.filter((problem) => problem.id !== problemId));
                })
                .catch((error) => {
                    console.error("Error deleting problem:", error);
                });
        }
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
        setEditProblem(null);
    };

    const handleEditSaveChanges = () => {
        fetch(`http://localhost:8080/problems/edit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editProblem),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update problem");
                }
                return response.text();
            })
            .then((data) => {
                alert(data);
                handleEditModalClose();
            })
            .catch((error) => {
                console.error("Error updating problem:", error);
                alert("Error updating problem: " + error.message);
            });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditProblem((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddProblemClick = () => {
        setShowAddModal(true);
    };

    const handleAddModalClose = () => {
        setShowAddModal(false);
        setNewProblem({
            title: "",
            description: "",
            tags: "",
            level: "easy",
            que_predefined_code_java: "",
            que_predefined_code_js: "",
            que_predefined_code_c: "",
            que_predefined_code_python: "",
        });
    };

    const handleAddProblemSubmit = () => {
        fetch(`http://localhost:8080/problems/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newProblem),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add problem");
                }
                return response.json();
            })
            .then((data) => {
                // Update problems list
                setProblems((prevProblems) => [...prevProblems, data]);
                fetchProblems();

                // Close the modal
                handleAddModalClose();

                // Reset form fields
                // resetFormFields();
            })
            .catch((error) => {
                console.error("Error adding problem:", error);
                alert("Error adding problem: " + error.message);
            });
    };

    const handleNewProblemChange = (e) => {
        const { name, value } = e.target;
        setNewProblem((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProblems = problems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(problems.length / itemsPerPage);

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
                        <img alt="" src={amd} width="30" height="30" />
                        {' '} Bridge2Code
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {/* <Nav.Link href="#home" active>Home</Nav.Link> */}
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

            <div className="pp-inner">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1>Problems</h1>
                    <Button variant="success" onClick={handleAddProblemClick}>
                        Add Problem
                    </Button>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Tags</th>
                                <th>Level</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProblems.map((problem) => (
                                <tr key={problem.id}>
                                    <td onClick={() => handleProblemClick(problem.id)}>{problem.id}</td>
                                    <td onClick={() => handleProblemClick(problem.id)}>{problem.title}</td>
                                    <td onClick={() => handleProblemClick(problem.id)}>{problem.tags}</td>
                                    <td onClick={() => handleProblemClick(problem.id)}>{problem.level}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm me-2"
                                            onClick={() => handleEdit(problem)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(problem.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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

            {/* Edit Problem Modal */}
            <Modal show={showEditModal} onHide={handleEditModalClose} >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Problem</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={editProblem?.title || ""}
                                        onChange={handleEditChange}
                                        style={{ height: "60px" }}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        value={editProblem?.description || ""}
                                        onChange={handleEditChange}
                                        style={{ height: "90px" }}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Tags</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="tags"
                                        value={editProblem?.tags || ""}
                                        onChange={handleEditChange}
                                        style={{ height: "60px" }}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Level</Form.Label>
                                    <Form.Select
                                        name="level"
                                        value={editProblem?.level || "easy"}
                                        onChange={handleEditChange}
                                        style={{ height: "60px" }}
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Java Code</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="que_predefined_code_java"
                                        value={editProblem?.que_predefined_code_java || ""}
                                        onChange={handleEditChange}
                                        style={{ height: "80px" }}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>JavaScript Code</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="que_predefined_code_js"
                                        value={editProblem?.que_predefined_code_js || ""}
                                        onChange={handleEditChange}
                                        style={{ height: "80px" }}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>C Code</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="que_predefined_code_c"
                                        value={editProblem?.que_predefined_code_c || ""}
                                        onChange={handleEditChange}
                                        style={{ height: "80px" }}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Python Code</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="que_predefined_code_python"
                                        value={editProblem?.que_predefined_code_python || ""}
                                        onChange={handleEditChange}
                                        style={{ height: "80px" }}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Testcases</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="tc_input"
                                        value={newProblem.tc_input}
                                        onChange={handleNewProblemChange}
                                        style={{ height: "50px" }}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Expected Output</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="tc_output"
                                        value={newProblem.tc_output}
                                        onChange={handleNewProblemChange}
                                        style={{ height: "50px" }}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEditSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Add Problem Modal */}
            <Modal show={showAddModal} onHide={handleAddModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Problem</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={newProblem.title}
                                        onChange={handleNewProblemChange}
                                        style={{ height: '60px' }}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        value={newProblem.description}
                                        onChange={handleNewProblemChange}
                                        style={{ height: '90px' }}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Tags</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="tags"
                                        value={newProblem.tags}
                                        onChange={handleNewProblemChange}
                                        style={{ height: '60px' }}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Level</Form.Label>
                                    <Form.Select
                                        name="level"
                                        value={newProblem.level}
                                        onChange={handleNewProblemChange}
                                        style={{ height: '60px' }}
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Java Code</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="que_predefined_code_java"
                                        value={newProblem.que_predefined_code_java}
                                        onChange={handleNewProblemChange}
                                        style={{ height: '80px' }}
                                    />
                                </Form.Group>
                            </div>

                            {/* Right Side - 5 Fields */}
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>JavaScript Code</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="que_predefined_code_js"
                                        value={newProblem.que_predefined_code_js}
                                        onChange={handleNewProblemChange}
                                        style={{ height: '80px' }}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>C Code</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="que_predefined_code_c"
                                        value={newProblem.que_predefined_code_c}
                                        onChange={handleNewProblemChange}
                                        style={{ height: '80px' }}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Python Code</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="que_predefined_code_python"
                                        value={newProblem.que_predefined_code_python}
                                        onChange={handleNewProblemChange}
                                        style={{ height: '80px' }}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Testcases</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="tc_input"
                                        value={newProblem.tc_input}
                                        onChange={handleNewProblemChange}
                                        style={{ height: '50px' }}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Expected Output</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="tc_output"
                                        value={newProblem.tc_output}
                                        onChange={handleNewProblemChange}
                                        style={{ height: '50px' }}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddProblemSubmit}>
                        Add Problem
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProblemsHandling;
