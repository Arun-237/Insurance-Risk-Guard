import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Navigation.css";

function Navigation() {
  return (
    <Navbar bg="dark" expand="lg" sticky="top" className="navbar-custom">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-logo">
          <i className="fas fa-shield-alt"></i> RiskGuard
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/admin" className="nav-link-custom">
              Admin
            </Nav.Link>
            <Nav.Link as={Link} to="/underwriter" className="nav-link-custom">
              Underwriter
            </Nav.Link>
            <Nav.Link as={Link} to="/customers" className="nav-link-custom">
              Customers
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/risk-assessment"
              className="nav-link-custom"
            >
              Risk Assessment
            </Nav.Link>
            <Nav.Link as={Link} to="/policies" className="nav-link-custom">
              Policies
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/underwriting-decisions"
              className="nav-link-custom"
            >
              Underwriting
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/premium-payments"
              className="nav-link-custom"
            >
              Premium Payments
            </Nav.Link>
            <Nav.Link as={Link} to="/analytics" className="nav-link-custom">
              Analytics
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
