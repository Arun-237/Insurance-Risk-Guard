import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import StatisticsCard from "../components/StatisticsCard";
import RiskDistributionChart from "../components/RiskDistributionChart";
import {
  getRiskAssessments,
  getUnderwritingDecisions,
  createUnderwritingDecision,
  updateUnderwritingDecision,
} from "../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

function UnderwriterDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingReview: 0,
    approvedCount: 0,
    declinedCount: 0,
    avgRiskScore: 0,
  });
  const [assessments, setAssessments] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [riskChartData, setRiskChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuickActionModal, setShowQuickActionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [assessmentsData, decisionsData] = await Promise.all([
        getRiskAssessments(),
        getUnderwritingDecisions(),
      ]);

      const assessmentsArray = Array.isArray(assessmentsData)
        ? assessmentsData
        : [];
      const decisionsArray = Array.isArray(decisionsData) ? decisionsData : [];

      setAssessments(assessmentsArray);
      setDecisions(decisionsArray);

      // Find pending decisions
      const pending = decisionsArray.filter((d) => d.status === "PENDING");
      setPendingItems(pending);

      // Calculate stats
      const totalApps = assessmentsArray.length;
      const avgRisk =
        totalApps > 0
          ? (
              assessmentsArray.reduce((sum, a) => sum + (a.riskScore || 0), 0) /
              totalApps
            ).toFixed(1)
          : 0;

      setStats({
        totalApplications: totalApps,
        pendingReview: pending.length,
        approvedCount: decisionsArray.filter((d) => d.status === "APPROVED")
          .length,
        declinedCount: decisionsArray.filter((d) => d.status === "DECLINED")
          .length,
        avgRiskScore: avgRisk,
      });

      // Risk score distribution chart
      const lowRisk = assessmentsArray.filter((a) => a.riskScore <= 30).length;
      const mediumRisk = assessmentsArray.filter(
        (a) => a.riskScore > 30 && a.riskScore <= 70,
      ).length;
      const highRisk = assessmentsArray.filter((a) => a.riskScore > 70).length;

      setRiskChartData({
        labels: [
          "Low Risk (0-30)",
          "Medium Risk (31-70)",
          "High Risk (71-100)",
        ],
        datasets: [
          {
            label: "Applications by Risk Level",
            data: [lowRisk, mediumRisk, highRisk],
            backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setStats({
        totalApplications: 0,
        pendingReview: 0,
        approvedCount: 0,
        declinedCount: 0,
        avgRiskScore: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReview = (decision) => {
    navigate("/underwriting-decisions");
  };

  const getRiskBadge = (score) => {
    if (score <= 30) return <Badge bg="success">Low Risk</Badge>;
    if (score <= 70) return <Badge bg="warning">Medium Risk</Badge>;
    return <Badge bg="danger">High Risk</Badge>;
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">
        <i className="fas fa-user-shield me-2"></i>
        Underwriter Dashboard - Risk Assessment & Approvals
      </h1>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <StatisticsCard
            title="Total Applications"
            value={stats.totalApplications}
            icon="file-alt"
            color="blue"
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatisticsCard
            title="Pending Review"
            value={stats.pendingReview}
            icon="clock"
            color="warning"
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatisticsCard
            title="Approved"
            value={stats.approvedCount}
            icon="check-circle"
            color="green"
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatisticsCard
            title="Avg Risk Score"
            value={stats.avgRiskScore}
            icon="chart-bar"
            color="info"
          />
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="mb-4">
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">
                <i className="fas fa-chart-bar me-2"></i>
                Risk Score Distribution
              </Card.Title>
            </Card.Header>
            <Card.Body>
              {riskChartData && (
                <Bar
                  data={riskChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  }}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className="mb-4">
          <RiskDistributionChart />
        </Col>
      </Row>

      {/* Pending Review Queue */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-warning">
              <Card.Title className="mb-0">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Applications Requiring Review ({pendingItems.length})
              </Card.Title>
            </Card.Header>
            <Card.Body>
              {pendingItems.length > 0 ? (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Decision ID</th>
                      <th>Customer ID</th>
                      <th>Assessment ID</th>
                      <th>Risk Score</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingItems.map((decision) => {
                      const assessment = assessments.find(
                        (a) => a.assessmentId === decision.assessmentId,
                      );
                      return (
                        <tr key={decision.decisionId}>
                          <td>
                            <strong>#{decision.decisionId}</strong>
                          </td>
                          <td>{decision.customerId}</td>
                          <td>{decision.assessmentId}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <strong className="me-2">
                                {assessment?.riskScore?.toFixed(1) || "N/A"}
                              </strong>
                              {assessment && getRiskBadge(assessment.riskScore)}
                            </div>
                          </td>
                          <td>
                            <Badge bg="warning">PENDING</Badge>
                          </td>
                          <td>
                            <small>{decision.decisionDate || "Today"}</small>
                          </td>
                          <td>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleQuickReview(decision)}
                            >
                              <i className="fas fa-eye me-1"></i>
                              Review
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info" className="mb-0">
                  <i className="fas fa-info-circle me-2"></i>
                  No applications pending review. Great work!
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Assessments */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">
                <i className="fas fa-history me-2"></i>
                Recent Risk Assessments (All Customers)
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer ID</th>
                    <th>Risk Score</th>
                    <th>Risk Level</th>
                    <th>Result</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.slice(0, 10).map((assessment) => {
                    const decision = decisions.find(
                      (d) => d.assessmentId === assessment.assessmentId,
                    );
                    return (
                      <tr key={assessment.assessmentId}>
                        <td>
                          <strong>#{assessment.assessmentId}</strong>
                        </td>
                        <td>{assessment.customerId}</td>
                        <td>
                          <strong>{assessment.riskScore?.toFixed(1)}</strong>
                        </td>
                        <td>{getRiskBadge(assessment.riskScore)}</td>
                        <td>
                          {decision ? (
                            <Badge
                              bg={
                                decision.status === "APPROVED"
                                  ? "success"
                                  : decision.status === "DECLINED"
                                    ? "danger"
                                    : decision.status === "PENDING"
                                      ? "warning"
                                      : "info"
                              }
                            >
                              {decision.status}
                            </Badge>
                          ) : (
                            <Badge bg="secondary">Not Reviewed</Badge>
                          )}
                        </td>
                        <td>
                          <small>
                            {assessment.assessmentDate ||
                              new Date().toLocaleDateString()}
                          </small>
                        </td>
                        <td>
                          {decision && decision.status === "PENDING" ? (
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleQuickReview(decision)}
                            >
                              Review
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              disabled
                            >
                              Processed
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              {assessments.length === 0 && (
                <p className="text-center text-muted py-3">
                  No risk assessments available
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UnderwriterDashboard;
