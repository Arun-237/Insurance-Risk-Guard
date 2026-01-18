import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Modal,
  Alert,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import { getPolicies, getCustomers, deletePolicy } from "../services/api";
import "../styles/PolicyManagement.css";

function PolicyManagement() {
  const [policies, setPolicies] = useState([]);
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      console.log("Fetching policies...");
      const [policiesData, customersData] = await Promise.all([
        getPolicies(),
        getCustomers(),
      ]);

      console.log("Policies response:", policiesData);
      console.log("Customers response:", customersData);

      setPolicies(Array.isArray(policiesData) ? policiesData : []);

      // Create customer map
      const customerMap = {};
      if (Array.isArray(customersData)) {
        customersData.forEach((c) => {
          customerMap[c.customerId] = c;
        });
      }
      setCustomers(customerMap);
    } catch (err) {
      console.error("Error fetching policies:", err);
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        url: err.config?.url,
      });
      setError(
        `Failed to load policies: ${err.message}. Is backend running on port 8080?`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewPolicy = (policy) => {
    setSelectedPolicy(policy);
    setShowModal(true);
  };

  const handleDeletePolicy = async (policyId) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      try {
        await deletePolicy(policyId);
        await fetchData();
      } catch (err) {
        setError("Failed to delete policy");
      }
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      ACTIVE: "success",
      EXPIRED: "danger",
      PENDING: "warning",
      SUSPENDED: "dark",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  const calculateStats = () => {
    const totalPolicies = policies.length;
    const activePolicies = policies.filter((p) => p.status === "ACTIVE").length;
    const expiredPolicies = policies.filter(
      (p) => p.status === "EXPIRED",
    ).length;
    const totalCoverageAmount = policies.reduce(
      (sum, p) => sum + (p.coverageAmount || 0),
      0,
    );

    return {
      totalPolicies,
      activePolicies,
      expiredPolicies,
      totalCoverageAmount,
    };
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <p>Loading policies...</p>
        </div>
      </Container>
    );
  }

  const stats = calculateStats();

  return (
    <Container className="py-5">
      <h1 className="mb-4">Policy Management</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h3>{stats.totalPolicies}</h3>
              <p>Total Policies</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card stat-active">
            <Card.Body className="text-center">
              <h3>{stats.activePolicies}</h3>
              <p>Active Policies</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card stat-expired">
            <Card.Body className="text-center">
              <h3>{stats.expiredPolicies}</h3>
              <p>Expired Policies</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h3>₹{(stats.totalCoverageAmount / 1000000).toFixed(1)}M</h3>
              <p>Total Coverage</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <Card.Title className="mb-0">All Policies</Card.Title>
        </Card.Header>
        <Card.Body>
          {policies && policies.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Policy ID</th>
                  <th>Policy Number</th>
                  <th>Customer</th>
                  <th>Coverage Amount</th>
                  <th>Premium Amount</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => {
                  const customer = customers[policy.customerId];
                  return (
                    <tr key={policy.policyId}>
                      <td>{policy.policyId}</td>
                      <td>{policy.policyNumber || `POL-${policy.policyId}`}</td>
                      <td>
                        {customer?.name || `Customer #${policy.customerId}`}
                      </td>
                      <td>₹{(policy.coverageAmount || 0).toLocaleString()}</td>
                      <td>₹{(policy.premiumAmount || 0).toLocaleString()}</td>
                      <td>{policy.startDate || "—"}</td>
                      <td>{policy.endDate || "—"}</td>
                      <td>{getStatusBadge(policy.status)}</td>
                      <td>
                        <div className="action-buttons">
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleViewPolicy(policy)}
                          >
                            <i className="fas fa-eye"></i> View
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeletePolicy(policy.policyId)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <div className="text-center text-muted p-5">
              <p>
                No policies found. Policies will be created when underwriting
                decisions are approved.
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Policy Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Policy Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPolicy && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <p>
                    <strong>Policy ID:</strong> {selectedPolicy.policyId}
                  </p>
                  <p>
                    <strong>Policy Number:</strong>{" "}
                    {selectedPolicy.policyNumber ||
                      `POL-${selectedPolicy.policyId}`}
                  </p>
                  <p>
                    <strong>Customer:</strong>{" "}
                    {customers[selectedPolicy.customerId]?.name ||
                      `Customer #${selectedPolicy.customerId}`}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Status:</strong>{" "}
                    {getStatusBadge(selectedPolicy.status)}
                  </p>
                  <p>
                    <strong>Coverage Type:</strong>{" "}
                    {selectedPolicy.coverageType || "Standard"}
                  </p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <p>
                    <strong>Coverage Amount:</strong> ₹
                    {(selectedPolicy.coverageAmount || 0).toLocaleString()}
                  </p>
                  <p>
                    <strong>Premium Amount:</strong> ₹
                    {(selectedPolicy.premiumAmount || 0).toLocaleString()}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {selectedPolicy.startDate || "N/A"}
                  </p>
                  <p>
                    <strong>End Date:</strong> {selectedPolicy.endDate || "N/A"}
                  </p>
                </Col>
              </Row>

              {selectedPolicy.terms && (
                <div>
                  <p>
                    <strong>Terms & Conditions:</strong>
                  </p>
                  <div className="policy-terms">{selectedPolicy.terms}</div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => window.print()}>
            <i className="fas fa-print"></i> Print
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PolicyManagement;
