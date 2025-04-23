import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, NavDropdown, Button, Modal, Form } from 'react-bootstrap';
import passPhoto from '../../images/Dashboard/default_avatar.jpg';
import amd from '../../images/Dashboard/amd.svg';
import '../../css/Dashboard/Dashboard1.css';
import { Link } from 'react-router-dom';

function Dashboard1() {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [editData, setEditData] = useState({ username: "", email: "" }); // State for editing user profile

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("token"+token);
        const response = await fetch("http://localhost:8080/dashboard", {
          headers: {
            // Authorization: `Bearer ${token}`,
            Authorization: token,
          },
        });
        console.log(response);
        if (response.ok) {
          console.log("hey pratik");
          //console.log("this is response:"+response.json());
          const data = await response.json();
          //console.log(await response.json());
          setDashboardData(data);
          console.log("Data"+data);
          setEditData({ username: data.username, email: data.email }); // Pre-fill form with current user data
        } else {
          const errorText = await response.text();
          setError(errorText);
        }
      } catch (err) {
        setError("Failed to fetch dashboard data.");
      }
    };

    fetchDashboardData();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        // Fetch updated dashboard data
        const dashboardResponse = await fetch("http://localhost:8080/dashboard", {
          headers: {
            Authorization: token,
          },
        });

        if (dashboardResponse.ok) {
          const updatedData = await dashboardResponse.json();
          setDashboardData(updatedData); // Update state with new data
          setShowModal(false); // Close the modal
        } else {
          const errorText = await dashboardResponse.text();
          setError(errorText);
        }
      } else {
        const errorText = await response.text();
        setError(errorText);
      }
    } catch (err) {
      setError("Failed to update profile.");
    }
  };


  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!dashboardData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="no-inherit">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="#home">
            <img alt="" src={amd} width="30" height="30" />
            {' '} Bridge2Code
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home" active>Home</Nav.Link>
              <Nav.Link as={Link} to="/problem">Problems</Nav.Link>
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

      {/* Dashboard Content */}
      <div className="dashboard">
        {/* User Profile Section */}
        <div className="profile line">
          <div className="photo">
            <img
              alt="user-avatar"
              src={passPhoto}
              className="rounded-circle"
              width="150"
              height="150"
            />
          </div>
          <h4 className="mt-3">{dashboardData.username}</h4>
          <p className="text-muted">{dashboardData.email}</p>
          <Button variant="primary" className="w-100" onClick={() => setShowModal(true)}>Edit Profile</Button>
        </div>

        {/* Stats Section */}
        <div className="stats line">
          <div className="total rounded-circle">
            <p className="circle-number count">
              {dashboardData.easySolved + dashboardData.mediumSolved + dashboardData.hardSolved}/
              {dashboardData.totalEasy + dashboardData.totalMedium + dashboardData.totalHard}
            </p>
          </div>

          <div className="difficultyLevel">
            <div className="level shadow-sm">
              <h6 style={{ color: 'green' }}>Easy</h6>
              <p className="circle-number">
                {dashboardData.easySolved}/{dashboardData.totalEasy}
              </p>
            </div>

            <div className="level shadow-sm">
              <h6 style={{ color: 'orange' }}>Medium</h6>
              <p className="circle-number">
                {dashboardData.mediumSolved}/{dashboardData.totalMedium}
              </p>
            </div>

            <div className="level shadow-sm">
              <h6 style={{ color: 'red' }}>Hard</h6>
              <p className="circle-number">
                {dashboardData.hardSolved}/{dashboardData.totalHard}
              </p>
            </div>
          </div>
        </div>

        {/* Category Section */}
        <div className="category line">
          {dashboardData.tags && dashboardData.tags.length > 0 ? (
            dashboardData.tags.map((tag, index) => (
              <Button key={index} variant="outline-primary" className="m-1">
                {tag}
              </Button>
            ))
          ) : (
            <p style={{ fontSize: '20px' }}><b>No categories solved yet.</b></p>
          )}
        </div>
      </div>

      {/* Modal for editing profile */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                value={editData.username}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={editData.email}
                onChange={handleEditChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Dashboard1;

