import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import {
  getUnderwritingDecisions,
  getRiskAssessments,
  updateUnderwritingDecision,
  deleteUnderwritingDecision,
  createPolicy,
  getCustomer,
  calculatePremium,
} from "../services/api";
import "../styles/UnderwritingDecisions.css";

function UnderwritingDecisions() {
  const [decisions, setDecisions] = useState([]);
  const [assessments, setAssessments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [notes, setNotes] = useState("");
  const [underwriterNotes, setUnderwriterNotes] = useState("");
  const [policyDetails, setPolicyDetails] = useState({
    coverageAmount: "",
    premiumAmount: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      console.log("Fetching underwriting decisions...");
      const [decisionsData, assessmentsData] = await Promise.all([
        getUnderwritingDecisions(),
        getRiskAssessments(),
      ]);

      console.log("Decisions response:", decisionsData);
      console.log("Assessments response:", assessmentsData);

      setDecisions(Array.isArray(decisionsData) ? decisionsData : []);

      // Create assessment map by ID
      const assessmentMap = {};
      if (Array.isArray(assessmentsData)) {
        assessmentsData.forEach((a) => {
          assessmentMap[a.assessmentId] = a;
        });
      }
      setAssessments(assessmentMap);
    } catch (err) {
      console.error("Error fetching data:", err);
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        url: err.config?.url,
      });
      setError(
        `Failed to load underwriting decisions: ${err.message}. Is backend running on port 8080?`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (decision, type) => {
    setSelectedDecision(decision);
    setActionType(type);
    setNotes("");
    setUnderwriterNotes("");
    setPolicyDetails({
      coverageAmount: "",
      premiumAmount: "",
      startDate: "",
      endDate: "",
    });
    setShowModal(true);
  };

  const handleDeleteDecision = async (decision) => {
    if (
      window.confirm(
        `Are you sure you want to delete decision #${decision.decisionId} for customer ${decision.customerId}?`,
      )
    ) {
      try {
        await deleteUnderwritingDecision(decision.decisionId);
        setDecisions(
          decisions.filter((d) => d.decisionId !== decision.decisionId),
        );
        alert("Decision deleted successfully!");
      } catch (err) {
        console.error("Failed to delete decision:", err);
        setError(`Failed to delete decision: ${err.message}`);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const assessment = assessments[selectedDecision.assessmentId];

      if (actionType === "approve") {
        if (!policyDetails.coverageAmount) {
          setError("Please provide coverage amount");
          return;
        }

        // Auto-calculate premium if not provided
        let premiumAmount = policyDetails.premiumAmount;
        if (!premiumAmount) {
          const riskScore = assessment?.riskScore ?? 50;
          try {
            premiumAmount = await calculatePremium(
              parseFloat(policyDetails.coverageAmount),
              parseFloat(riskScore),
            );
            setPolicyDetails((prev) => ({
              ...prev,
              premiumAmount: premiumAmount,
            }));
          } catch (calcErr) {
            console.error("Premium calculation failed:", calcErr);
            setError("Premium calculation failed. Please enter manually.");
            return;
          }
        }

        // Create policy
        const newPolicy = {
          customerId: selectedDecision.customerId,
          coverageAmount: parseFloat(policyDetails.coverageAmount),
          premiumAmount: parseFloat(premiumAmount),
          startDate: policyDetails.startDate,
          endDate: policyDetails.endDate,
          status: "ACTIVE",
        };

        await createPolicy(newPolicy);

        // Update decision
        const updatedDecision = {
          ...selectedDecision,
          status: "APPROVED",
          reason: notes,
          underwriterNotes: underwriterNotes,
          approvalDate: new Date().toISOString().split("T")[0],
        };
        await updateUnderwritingDecision(
          selectedDecision.decisionId,
          updatedDecision,
        );
      } else if (actionType === "decline") {
        const updatedDecision = {
          ...selectedDecision,
          status: "DECLINED",
          reason: notes,
          underwriterNotes: underwriterNotes,
        };
        await updateUnderwritingDecision(
          selectedDecision.decisionId,
          updatedDecision,
        );
      } else if (actionType === "hold") {
        const updatedDecision = {
          ...selectedDecision,
          status: "ON_HOLD",
          underwriterNotes: underwriterNotes,
        };
        await updateUnderwritingDecision(
          selectedDecision.decisionId,
          updatedDecision,
        );
      }

      setShowModal(false);
      await fetchData();
      setError(null);
    } catch (err) {
      console.error("Error processing decision:", err);
      setError("Failed to process decision");
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      APPROVED: "success",
      DECLINED: "danger",
      PENDING: "warning",
      ON_HOLD: "info",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getDecisionIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <i className="fas fa-check-circle text-success"></i>;
      case "DECLINED":
        return <i className="fas fa-times-circle text-danger"></i>;
      case "PENDING":
        return <i className="fas fa-hourglass text-warning"></i>;
      case "ON_HOLD":
        return <i className="fas fa-pause-circle text-info"></i>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <p>Loading underwriting decisions...</p>
        </div>
      </Container>
    );
  }

  const pendingDecisions = decisions.filter((d) => d.status === "PENDING");
  const completedDecisions = decisions.filter((d) => d.status !== "PENDING");

  return (
    <Container className="py-5">
      <h1 className="mb-4">Underwriting Decisions</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center stat-card">
            <Card.Body>
              <h3>{decisions.length}</h3>
              <p>Total Decisions</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center stat-card stat-pending">
            <Card.Body>
              <h3>{pendingDecisions.length}</h3>
              <p>Pending</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center stat-card stat-approved">
            <Card.Body>
              <h3>{decisions.filter((d) => d.status === "APPROVED").length}</h3>
              <p>Approved</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center stat-card stat-declined">
            <Card.Body>
              <h3>{decisions.filter((d) => d.status === "DECLINED").length}</h3>
              <p>Declined</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {pendingDecisions.length > 0 && (
        <Card className="mb-4 pending-section">
          <Card.Header className="bg-warning">
            <Card.Title className="mb-0">
              Pending Decisions ({pendingDecisions.length})
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Decision ID</th>
                  <th>Customer ID</th>
                  <th>Assessment ID</th>
                  <th>Risk Score</th>
                  <th>Status</th>
                  <th>Sent to Underwriting</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingDecisions.map((decision) => {
                  const assessment = assessments[decision.assessmentId];
                  const sentDate = decision.sentToUnderwritingDate
                    ? new Date(decision.sentToUnderwritingDate).toLocaleString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        },
                      )
                    : "N/A";
                  return (
                    <tr key={decision.decisionId}>
                      <td>{decision.decisionId}</td>
                      <td>{decision.customerId}</td>
                      <td>{decision.assessmentId}</td>
                      <td>{assessment?.riskScore?.toFixed(2) || "N/A"}</td>
                      <td>{getStatusBadge(decision.status)}</td>
                      <td>{sentDate}</td>
                      <td>
                        <div className="action-buttons-group">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleAction(decision, "approve")}
                            title="Approve"
                          >
                            <i className="fas fa-check"></i> Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleAction(decision, "decline")}
                            title="Decline"
                          >
                            <i className="fas fa-times"></i> Decline
                          </Button>
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleAction(decision, "hold")}
                            title="Hold"
                          >
                            <i className="fas fa-pause"></i> Hold
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteDecision(decision)}
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i> Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {completedDecisions.length > 0 && (
        <Card>
          <Card.Header>
            <Card.Title className="mb-0">
              Decision History ({completedDecisions.length})
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Decision ID</th>
                  <th>Customer ID</th>
                  <th>Assessment ID</th>
                  <th>Risk Score</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Decision Date</th>
                  <th>Decided By</th>
                </tr>
              </thead>
              <tbody>
                {completedDecisions.map((decision) => {
                  const assessment = assessments[decision.assessmentId];
                  return (
                    <tr key={decision.decisionId}>
                      <td>{decision.decisionId}</td>
                      <td>{decision.customerId}</td>
                      <td>{decision.assessmentId}</td>
                      <td>{assessment?.riskScore?.toFixed(2) || "N/A"}</td>
                      <td>
                        {getDecisionIcon(decision.status)}{" "}
                        {getStatusBadge(decision.status)}
                      </td>
                      <td>{decision.reason || "—"}</td>
                      <td>{decision.decisionDate || "N/A"}</td>
                      <td>{decision.decidedBy || "System"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {decisions.length === 0 && (
        <Card>
          <Card.Body className="text-center text-muted p-5">
            <p>No underwriting decisions found.</p>
          </Card.Body>
        </Card>
      )}

      {/* Decision Action Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === "approve" && "Approve Application"}
            {actionType === "decline" && "Decline Application"}
            {actionType === "hold" && "Hold Application for Review"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDecision && (
            <div>
              <div className="mb-4">
                <h6>Decision Information</h6>
                <p>
                  <strong>Decision ID:</strong> {selectedDecision.decisionId}
                </p>
                <p>
                  <strong>Customer ID:</strong> {selectedDecision.customerId}
                </p>
                {assessments[selectedDecision.assessmentId] && (
                  <>
                    <p>
                      <strong>Risk Score:</strong>{" "}
                      {assessments[
                        selectedDecision.assessmentId
                      ].riskScore?.toFixed(2)}
                    </p>
                    <p>
                      <strong>Risk Level:</strong>{" "}
                      {assessments[selectedDecision.assessmentId].riskLevel}
                    </p>
                  </>
                )}
              </div>

              <Form>
                {actionType === "approve" && (
                  <>
                    <h6>Policy Details</h6>
                    <Form.Group className="mb-3">
                      <Form.Label>Coverage Amount *</Form.Label>
                      <Form.Control
                        type="number"
                        value={policyDetails.coverageAmount}
                        onChange={(e) =>
                          setPolicyDetails({
                            ...policyDetails,
                            coverageAmount: e.target.value,
                          })
                        }
                        placeholder="Enter coverage amount"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Premium Amount</Form.Label>
                      <Row>
                        <Col>
                          <Form.Control
                            type="number"
                            value={policyDetails.premiumAmount}
                            onChange={(e) =>
                              setPolicyDetails({
                                ...policyDetails,
                                premiumAmount: e.target.value,
                              })
                            }
                            placeholder="Enter premium amount or calculate"
                          />
                        </Col>
                        <Col xs="auto">
                          <Button
                            variant="outline-primary"
                            onClick={async () => {
                              try {
                                const riskScore =
                                  assessments[selectedDecision.assessmentId]
                                    ?.riskScore ?? 50;
                                const premium = await calculatePremium(
                                  parseFloat(policyDetails.coverageAmount),
                                  parseFloat(riskScore),
                                );
                                setPolicyDetails((prev) => ({
                                  ...prev,
                                  premiumAmount: premium,
                                }));
                                setError(null);
                              } catch (err) {
                                console.error(
                                  "Failed to calculate premium",
                                  err,
                                );
                                setError(
                                  "Failed to calculate premium. Please try again.",
                                );
                              }
                            }}
                          >
                            Calculate Premium
                          </Button>
                        </Col>
                      </Row>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={policyDetails.startDate}
                        onChange={(e) =>
                          setPolicyDetails({
                            ...policyDetails,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={policyDetails.endDate}
                        onChange={(e) =>
                          setPolicyDetails({
                            ...policyDetails,
                            endDate: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Approval Notes</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter approval notes"
                      />
                    </Form.Group>
                  </>
                )}

                {actionType === "decline" && (
                  <Form.Group className="mb-3">
                    <Form.Label>Decline Reason *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Enter reason for decline"
                      required
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Underwriter Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={underwriterNotes}
                    onChange={(e) => setUnderwriterNotes(e.target.value)}
                    placeholder="Enter additional notes"
                  />
                </Form.Group>
              </Form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant={
              actionType === "approve"
                ? "success"
                : actionType === "decline"
                  ? "danger"
                  : "info"
            }
            onClick={handleSubmit}
          >
            {actionType === "approve" && "Approve & Create Policy"}
            {actionType === "decline" && "Decline Application"}
            {actionType === "hold" && "Put on Hold"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default UnderwritingDecisions;
