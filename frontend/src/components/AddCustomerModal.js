import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";

function AddCustomerModal({ show, handleClose, handleAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    insuranceType: "HEALTH",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    contactInfo: ""
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.dateOfBirth || !formData.email || !formData.phone) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      handleAdd(formData);
      setFormData({
        name: "",
        dateOfBirth: "",
        email: "",
        phone: "",
        insuranceType: "HEALTH",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        contactInfo: ""
      });
      handleClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Customer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter customer name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date of Birth *</Form.Label>
            <Form.Control
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone *</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Insurance Type</Form.Label>
            <Form.Select
              name="insuranceType"
              value={formData.insuranceType}
              onChange={handleChange}
            >
              <option value="HEALTH">Health</option>
              <option value="LIFE">Life</option>
              <option value="MOTOR">Motor</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter street address"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Zip Code</Form.Label>
            <Form.Control
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="Enter zip code"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contact Info</Form.Label>
            <Form.Control
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="Enter additional contact information"
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="primary" type="submit" className="w-100">
              Add Customer
            </Button>
            <Button variant="secondary" onClick={handleClose} className="w-100">
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddCustomerModal;
