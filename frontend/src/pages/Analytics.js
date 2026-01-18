import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Table,
  Alert,
  Button,
  ProgressBar,
} from "react-bootstrap";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getRiskAssessments,
  getUnderwritingDecisions,
  getPolicies,
  getPremiumPayments,
  getCustomers,
} from "../services/api";
import "../styles/Analytics.css";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setError(null);
      const [
        assessmentsData,
        decisionsData,
        policiesData,
        paymentsData,
        customersData,
      ] = await Promise.all([
        getRiskAssessments(),
        getUnderwritingDecisions(),
        getPolicies(),
        getPremiumPayments(),
        getCustomers(),
      ]);

      const assessments = Array.isArray(assessmentsData) ? assessmentsData : [];
      const decisions = Array.isArray(decisionsData) ? decisionsData : [];
      const policies = Array.isArray(policiesData) ? policiesData : [];
      const payments = Array.isArray(paymentsData) ? paymentsData : [];
      const customers = Array.isArray(customersData) ? customersData : [];

      // Calculate metrics
      const approvalRate =
        decisions.length > 0
          ? (
              (decisions.filter((d) => d.status === "APPROVED").length /
                decisions.length) *
              100
            ).toFixed(2)
          : 0;

      const averageRiskScore =
        assessments.length > 0
          ? (
              assessments.reduce((sum, a) => sum + (a.riskScore || 0), 0) /
              assessments.length
            ).toFixed(2)
          : 0;

      const riskDistribution = {
        LOW: assessments.filter((a) => a.riskLevel === "LOW").length,
        MEDIUM: assessments.filter((a) => a.riskLevel === "MEDIUM").length,
        HIGH: assessments.filter((a) => a.riskLevel === "HIGH").length,
        CRITICAL: assessments.filter((a) => a.riskLevel === "CRITICAL").length,
      };

      const decisionDistribution = {
        APPROVED: decisions.filter((d) => d.status === "APPROVED").length,
        DECLINED: decisions.filter((d) => d.status === "DECLINED").length,
        PENDING: decisions.filter((d) => d.status === "PENDING").length,
        ON_HOLD: decisions.filter((d) => d.status === "ON_HOLD").length,
      };

      const paymentMetrics = {
        totalPayments: payments.length,
        paidPayments: payments.filter((p) => p.status === "PAID").length,
        unpaidPayments: payments.filter((p) => p.status === "UNPAID").length,
        totalAmount: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
        paidAmount: payments
          .filter((p) => p.status === "PAID")
          .reduce((sum, p) => sum + (p.amount || 0), 0),
      };

      const collectionRate =
        paymentMetrics.totalAmount > 0
          ? (
              (paymentMetrics.paidAmount / paymentMetrics.totalAmount) *
              100
            ).toFixed(2)
          : 0;

      // High-risk customers
      const highRiskCustomers = assessments
        .filter((a) => a.riskLevel === "HIGH" || a.riskLevel === "CRITICAL")
        .map((a) => ({
          customerId: a.customerId,
          riskScore: a.riskScore,
          riskLevel: a.riskLevel,
        }))
        .slice(0, 5);

      // Fraud patterns (simulated - in real system would analyze claim data)
      const fraudPatterns = [
        { type: "Multiple Claims", count: 3, percentage: 15 },
        { type: "High Value Claims", count: 5, percentage: 25 },
        { type: "Short Coverage Claims", count: 2, percentage: 10 },
      ];

      setAnalytics({
        totalCustomers: customers.length,
        totalAssessments: assessments.length,
        totalDecisions: decisions.length,
        totalPolicies: policies.length,
        approvalRate,
        averageRiskScore,
        riskDistribution,
        decisionDistribution,
        paymentMetrics,
        collectionRate,
        highRiskCustomers,
        fraudPatterns,
        assessments,
        decisions,
        payments,
      });
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    if (!analytics) return;

    const reportData = {
      generatedAt: new Date().toISOString(),
      metrics: {
        totalCustomers: analytics.totalCustomers,
        totalAssessments: analytics.totalAssessments,
        approvalRate: analytics.approvalRate,
        averageRiskScore: analytics.averageRiskScore,
        paymentCollectionRate: analytics.collectionRate,
      },
      riskDistribution: analytics.riskDistribution,
      decisionDistribution: analytics.decisionDistribution,
      paymentMetrics: analytics.paymentMetrics,
      highRiskCustomers: analytics.highRiskCustomers,
      fraudPatterns: analytics.fraudPatterns,
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `risk-analytics-report-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <p>Loading analytics...</p>
        </div>
      </Container>
    );
  }

  if (!analytics) {
    return (
      <Container className="py-5">
        <Alert variant="info">No analytics data available</Alert>
      </Container>
    );
  }

  const riskDistributionData = [
    { name: "LOW", value: analytics.riskDistribution.LOW, fill: "#28a745" },
    {
      name: "MEDIUM",
      value: analytics.riskDistribution.MEDIUM,
      fill: "#ffc107",
    },
    { name: "HIGH", value: analytics.riskDistribution.HIGH, fill: "#fd7e14" },
    {
      name: "CRITICAL",
      value: analytics.riskDistribution.CRITICAL,
      fill: "#dc3545",
    },
  ];

  const decisionDistributionData = [
    {
      name: "APPROVED",
      value: analytics.decisionDistribution.APPROVED,
      fill: "#28a745",
    },
    {
      name: "DECLINED",
      value: analytics.decisionDistribution.DECLINED,
      fill: "#dc3545",
    },
    {
      name: "PENDING",
      value: analytics.decisionDistribution.PENDING,
      fill: "#ffc107",
    },
    {
      name: "ON_HOLD",
      value: analytics.decisionDistribution.ON_HOLD,
      fill: "#17a2b8",
    },
  ];

  return (
    <Container fluid className="py-5 analytics-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Risk Analytics & Reporting</h1>
        <Button variant="success" onClick={handleExportReport}>
          <i className="fas fa-download"></i> Export Report
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Key Metrics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-icon">
                <i className="fas fa-users"></i>
              </div>
              <h6>Total Customers</h6>
              <h2>{analytics.totalCustomers}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <h6>Assessments</h6>
              <h2>{analytics.totalAssessments}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h6>Approval Rate</h6>
              <h2>{analytics.approvalRate}%</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h6>Avg Risk Score</h6>
              <h2>{analytics.averageRiskScore}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">Risk Distribution</Card.Title>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ value }) => `${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `Count: ${value}`} />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">Decision Distribution</Card.Title>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={decisionDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ value }) => `${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {decisionDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `Count: ${value}`} />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Payment Metrics */}
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">
                Payment Collection Metrics
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="payment-stat">
                    <h6>Total Payments</h6>
                    <h3>{analytics.paymentMetrics.totalPayments}</h3>
                    <p className="text-muted">payment records</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="payment-stat">
                    <h6>Paid Payments</h6>
                    <h3 className="text-success">
                      {analytics.paymentMetrics.paidPayments}
                    </h3>
                    <p className="text-muted">successfully received</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="payment-stat">
                    <h6>Outstanding</h6>
                    <h3 className="text-warning">
                      {analytics.paymentMetrics.unpaidPayments}
                    </h3>
                    <p className="text-muted">pending payments</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="payment-stat">
                    <h6>Collection Rate</h6>
                    <h3>{analytics.collectionRate}%</h3>
                    <ProgressBar
                      now={parseFloat(analytics.collectionRate)}
                      label={`${analytics.collectionRate}%`}
                    />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* High Risk Customers */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-danger">
              <Card.Title className="mb-0 text-white">
                High-Risk Customers
              </Card.Title>
            </Card.Header>
            <Card.Body>
              {analytics.highRiskCustomers.length > 0 ? (
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Customer ID</th>
                      <th>Risk Score</th>
                      <th>Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.highRiskCustomers.map((customer, idx) => (
                      <tr key={idx}>
                        <td>{customer.customerId}</td>
                        <td>{customer.riskScore?.toFixed(2)}</td>
                        <td>
                          <span
                            className={`badge bg-${
                              customer.riskLevel === "CRITICAL"
                                ? "danger"
                                : "warning"
                            }`}
                          >
                            {customer.riskLevel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">No high-risk customers</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Fraud Patterns */}
        <Col md={6}>
          <Card>
            <Card.Header className="bg-warning">
              <Card.Title className="mb-0">Potential Fraud Patterns</Card.Title>
            </Card.Header>
            <Card.Body>
              {analytics.fraudPatterns.map((pattern, idx) => (
                <div key={idx} className="fraud-pattern-item mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>{pattern.type}</span>
                    <span className="badge bg-info">{pattern.count} cases</span>
                  </div>
                  <ProgressBar
                    now={pattern.percentage}
                    label={`${pattern.percentage}%`}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Risk Assessment Details Table */}
      <Card>
        <Card.Header>
          <Card.Title className="mb-0">Recent Risk Assessments</Card.Title>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive size="sm">
            <thead>
              <tr>
                <th>Assessment ID</th>
                <th>Customer ID</th>
                <th>Risk Score</th>
                <th>Risk Level</th>
                <th>Result</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {analytics.assessments.slice(0, 10).map((assessment) => (
                <tr key={assessment.assessmentId}>
                  <td>{assessment.assessmentId}</td>
                  <td>{assessment.customerId}</td>
                  <td>{assessment.riskScore?.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        assessment.riskLevel === "LOW"
                          ? "success"
                          : assessment.riskLevel === "MEDIUM"
                            ? "warning"
                            : assessment.riskLevel === "HIGH"
                              ? "danger"
                              : "dark"
                      }`}
                    >
                      {assessment.riskLevel}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge bg-${
                        assessment.result === "APPROVED"
                          ? "success"
                          : assessment.result === "DECLINED"
                            ? "danger"
                            : "warning"
                      }`}
                    >
                      {assessment.result}
                    </span>
                  </td>
                  <td>{assessment.assessmentDate || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Analytics;
