import React, { useState, useEffect } from "react";
import { Container, Card, Button, Table, Badge, Modal, Row, Col } from "react-bootstrap";
import { getCustomers, createCustomer } from "../services/api";
import AddCustomerModal from "../components/AddCustomerModal";
import "../styles/CustomerProfile.css";

function CustomerProfile() {
  const [customers, setCustomers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (formData) => {
    try {
      await createCustomer(formData);
      fetchCustomers();
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  const calculateAge = (dateOfBirth) => {
    return Math.floor(
      (new Date() - new Date(dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)
    );
  };

  if (loading) {
    return <Container className="py-5">Loading customers...</Container>;
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Customers Management</h1>
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          className="btn-add-customer"
        >
          <i className="fas fa-plus"></i> Add New Customer
        </Button>
      </div>

      <Card>
        <Card.Header>
          <Card.Title className="mb-0">Customer List</Card.Title>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Insurance Type</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Documents</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customerId}>
                  <td>{customer.name}</td>
                  <td>{calculateAge(customer.dateOfBirth)} years</td>
                  <td>
                    <Badge bg="info">{customer.insuranceType}</Badge>
                  </td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>
                    <Badge
                      bg={customer.documentVerified ? "success" : "warning"}
                    >
                      {customer.documentVerified ? "Verified" : "Pending"}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleViewCustomer(customer)}
                    >
                      <i className="fas fa-eye"></i> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <AddCustomerModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handleAdd={handleAddCustomer}
      />

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer && (
            <Row>
              <Col md={6}>
                <h6 className="mb-3">Personal Information</h6>
                <Table size="sm" borderless>
                  <tbody>
                    <tr>
                      <td><strong>Name:</strong></td>
                      <td>{selectedCustomer.name}</td>
                    </tr>
                    <tr>
                      <td><strong>Date of Birth:</strong></td>
                      <td>{selectedCustomer.dateOfBirth} ({calculateAge(selectedCustomer.dateOfBirth)} years)</td>
                    </tr>
                    <tr>
                      <td><strong>Insurance Type:</strong></td>
                      <td>
                        <Badge bg="info">{selectedCustomer.insuranceType}</Badge>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col md={6}>
                <h6 className="mb-3">Contact Information</h6>
                <Table size="sm" borderless>
                  <tbody>
                    <tr>
                      <td><strong>Email:</strong></td>
                      <td>{selectedCustomer.email}</td>
                    </tr>
                    <tr>
                      <td><strong>Phone:</strong></td>
                      <td>{selectedCustomer.phone}</td>
                    </tr>
                    <tr>
                      <td><strong>Contact Info:</strong></td>
                      <td>{selectedCustomer.contactInfo || "N/A"}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          )}
          {selectedCustomer && (
            <Row className="mt-4">
              <Col md={6}>
                <h6 className="mb-3">Address</h6>
                <Table size="sm" borderless>
                  <tbody>
                    <tr>
                      <td><strong>Street:</strong></td>
                      <td>{selectedCustomer.address}</td>
                    </tr>
                    <tr>
                      <td><strong>City:</strong></td>
                      <td>{selectedCustomer.city}</td>
                    </tr>
                    <tr>
                      <td><strong>State:</strong></td>
                      <td>{selectedCustomer.state}</td>
                    </tr>
                    <tr>
                      <td><strong>Zip Code:</strong></td>
                      <td>{selectedCustomer.zipCode}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col md={6}>
                <h6 className="mb-3">Verification Status</h6>
                <Table size="sm" borderless>
                  <tbody>
                    <tr>
                      <td><strong>Documents:</strong></td>
                      <td>
                        <Badge bg={selectedCustomer.documentVerified ? "success" : "warning"}>
                          {selectedCustomer.documentVerified ? "Verified" : "Not Verified"}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Created:</strong></td>
                      <td>{selectedCustomer.createdAt || "N/A"}</td>
                    </tr>
                    <tr>
                      <td><strong>Updated:</strong></td>
                      <td>{selectedCustomer.updatedAt || "N/A"}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CustomerProfile;
