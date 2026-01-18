import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Card, Modal, Row, Col } from "react-bootstrap";
import {
  getRiskAssessments,
  createUnderwritingDecision,
  updateRiskAssessmentStatus,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/RiskAssessmentTable.css";

function RiskAssessmentTable({ forReview = false }) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssessments();
  }, [forReview]);

  const fetchAssessments = async () => {
    try {
      const data = await getRiskAssessments();
      // Filter out assessments that have been sent to underwriting
      const filtered = data.filter((a) => a.status !== "SENT_TO_UNDERWRITING");
      // Apply additional filter for review if needed
      const finalFiltered = forReview
        ? filtered.filter((a) => a.result === "REVIEW_REQUIRED")
        : filtered;
      setAssessments(finalFiltered);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case "LOW":
        return "success";
      case "MEDIUM":
        return "warning";
      case "HIGH":
        return "danger";
      case "CRITICAL":
        return "dark";
      default:
        return "secondary";
    }
  };

  const getResultBadgeColor = (result) => {
    switch (result) {
      case "APPROVED":
        return "success";
      case "DECLINED":
        return "danger";
      case "REVIEW_REQUIRED":
        return "warning";
      default:
        return "secondary";
    }
  };

  const handleViewAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setShowViewModal(true);
  };

  const handleSendToUnderwriting = async (assessment) => {
    if (!assessment) return;
    try {
      setSubmitting(true);

      // Update assessment status to SENT_TO_UNDERWRITING
      await updateRiskAssessmentStatus(
        assessment.assessmentId,
        "SENT_TO_UNDERWRITING",
      );

      // Create underwriting decision
      const payload = {
        customerId: assessment.customerId,
        assessmentId: assessment.assessmentId,
        status: "PENDING",
        reason: "Awaiting underwriter action",
        underwriterNotes: "Created from Risk Assessment",
        decidedBy: "Underwriter",
      };
      await createUnderwritingDecision(payload);

      // Remove the sent assessment from the list
      setAssessments(
        assessments.filter((a) => a.assessmentId !== assessment.assessmentId),
      );
      setShowViewModal(false);
      // Navigate to underwriting decisions to act on it
      navigate("/underwriting-decisions");
    } catch (err) {
      console.error("Failed to create underwriting decision:", err);
      alert(`Failed to create decision: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <p>Loading assessments...</p>
      </div>
    );
  }

  return (
    <>
      <Card>
        <Card.Header>
          <Card.Title className="mb-0">
            {forReview
              ? "Assessments Requiring Review"
              : "All Risk Assessments"}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Assessment ID</th>
                <th>Customer ID</th>
                <th>Risk Score</th>
                <th>Risk Level</th>
                <th>Result</th>
                <th>Manual Review</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((assessment) => (
                <tr key={assessment.assessmentId}>
                  <td>{assessment.assessmentId}</td>
                  <td>{assessment.customerId}</td>
                  <td>{assessment.riskScore}</td>
                  <td>
                    <Badge bg={getRiskBadgeColor(assessment.riskLevel)}>
                      {assessment.riskLevel}
                    </Badge>
                  </td>
                  <td>
                    <Badge
                      bg={
                        assessment.result === "APPROVED"
                          ? "success"
                          : assessment.result === "DECLINED"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {assessment.result}
                    </Badge>
                  </td>
                  <td>{assessment.flaggedForManualReview ? "Yes" : "No"}</td>
                  <td>{assessment.assessmentDate}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewAssessment(assessment)}
                      >
                        <i className="fas fa-eye"></i> View
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        disabled={submitting}
                        onClick={() => handleSendToUnderwriting(assessment)}
                        title="Create underwriting decision (PENDING)"
                      >
                        <i className="fas fa-share-square"></i> Send to
                        Underwriting
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {assessments.length === 0 && (
            <p className="text-center text-muted mt-3">No assessments found</p>
          )}
        </Card.Body>
      </Card>

      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Risk Assessment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAssessment && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h6 className="mb-3">Assessment Information</h6>
                  <Table size="sm" borderless>
                    <tbody>
                      <tr>
                        <td>
                          <strong>Assessment ID:</strong>
                        </td>
                        <td>{selectedAssessment.assessmentId}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Customer ID:</strong>
                        </td>
                        <td>{selectedAssessment.customerId}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Assessment Date:</strong>
                        </td>
                        <td>{selectedAssessment.assessmentDate}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <h6 className="mb-3">Risk Metrics</h6>
                  <Table size="sm" borderless>
                    <tbody>
                      <tr>
                        <td>
                          <strong>Risk Score:</strong>
                        </td>
                        <td>
                          <strong
                            style={{ fontSize: "18px", color: "#007bff" }}
                          >
                            {selectedAssessment.riskScore}/100
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Risk Level:</strong>
                        </td>
                        <td>
                          <Badge
                            bg={getRiskBadgeColor(selectedAssessment.riskLevel)}
                          >
                            {selectedAssessment.riskLevel}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Result:</strong>
                        </td>
                        <td>
                          <Badge
                            bg={getResultBadgeColor(selectedAssessment.result)}
                          >
                            {selectedAssessment.result}
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={12}>
                  <h6 className="mb-3">Assessment Details</h6>
                  <Table size="sm" borderless>
                    <tbody>
                      <tr>
                        <td>
                          <strong>Explanation:</strong>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {selectedAssessment.explanation ||
                            "No explanation provided"}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Rules Applied:</strong>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {selectedAssessment.rulesApplied ||
                            "No rules specified"}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Flagged for Manual Review:</strong>
                        </td>
                        <td>
                          <Badge
                            bg={
                              selectedAssessment.flaggedForManualReview
                                ? "warning"
                                : "success"
                            }
                          >
                            {selectedAssessment.flaggedForManualReview
                              ? "Yes"
                              : "No"}
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RiskAssessmentTable;
