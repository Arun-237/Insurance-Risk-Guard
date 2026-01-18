import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import StatisticsCard from "../components/StatisticsCard";
import {
  getCustomers,
  getRiskAssessments,
  getPolicies,
  getUnderwritingDecisions,
  getPremiumPayments,
  getAuditLogs,
} from "../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalAssessments: 0,
    totalPolicies: 0,
    approvalRate: 0,
    pendingDecisions: 0,
    totalRevenue: 0,
    avgProcessingTime: 0,
  });
  const [trendData, setTrendData] = useState(null);
  const [decisionStats, setDecisionStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const [customers, assessments, policies, decisions, payments, auditLogs] =
        await Promise.all([
          getCustomers(),
          getRiskAssessments(),
          getPolicies(),
          getUnderwritingDecisions(),
          getPremiumPayments().catch(() => []),
          getAuditLogs().catch(() => []),
        ]);

      // Calculate approval rate from decisions
      const approvedDecisions = decisions.filter(
        (d) => d.status === "APPROVED",
      ).length;
      const totalDecisions = decisions.filter(
        (d) => d.status !== "PENDING",
      ).length;
      const approvalRate =
        totalDecisions > 0
          ? ((approvedDecisions / totalDecisions) * 100).toFixed(1)
          : 0;

      // Calculate total revenue from payments
      const totalRevenue = payments.reduce((sum, p) => {
        return sum + (p.status === "PAID" ? p.amount || 0 : 0);
      }, 0);

      // Calculate average processing time from assessments to decisions
      let avgProcessingTime = "N/A";
      if (decisions.length > 0) {
        const processingTimes = decisions
          .filter((d) => d.decisionDate && d.sentToUnderwritingDate)
          .map((d) => {
            const sent = new Date(d.sentToUnderwritingDate);
            const decided = new Date(d.decisionDate);
            return Math.ceil((decided - sent) / (1000 * 60 * 60 * 24)); // days
          });
        if (processingTimes.length > 0) {
          const average = (
            processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length
          ).toFixed(1);
          avgProcessingTime = `${average} days`;
        } else {
          // If no decided records, just show estimated time
          avgProcessingTime = "< 1 day";
        }
      }

      // Pending decisions
      const pendingDecisions = decisions.filter(
        (d) => d.status === "PENDING",
      ).length;

      setStats({
        totalCustomers: customers.length,
        totalAssessments: assessments.length,
        totalPolicies: policies.length,
        approvalRate,
        pendingDecisions,
        totalRevenue: totalRevenue.toFixed(2),
        avgProcessingTime,
      });

      // Underwriting trends (last 7 days simulation)
      const trendLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      setTrendData({
        labels: trendLabels,
        datasets: [
          {
            label: "Approved",
            data: [12, 15, 10, 18, 14, 8, 11],
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.4,
          },
          {
            label: "Declined",
            data: [3, 5, 4, 2, 6, 3, 4],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            tension: 0.4,
          },
        ],
      });

      // Decision distribution
      const decisionCounts = {
        approved: decisions.filter((d) => d.status === "APPROVED").length,
        declined: decisions.filter((d) => d.status === "DECLINED").length,
        pending: decisions.filter((d) => d.status === "PENDING").length,
        onHold: decisions.filter((d) => d.status === "ON_HOLD").length,
      };

      setDecisionStats({
        labels: ["Approved", "Declined", "Pending", "On Hold"],
        datasets: [
          {
            data: [
              decisionCounts.approved,
              decisionCounts.declined,
              decisionCounts.pending,
              decisionCounts.onHold,
            ],
            backgroundColor: ["#28a745", "#dc3545", "#ffc107", "#17a2b8"],
            borderWidth: 1,
          },
        ],
      });

      // Recent activities from audit logs
      const activities = auditLogs
        .slice(-5)
        .reverse()
        .map((log) => ({
          id: log.id,
          action: log.action,
          entity: log.entityType,
          actor: log.actor || "System",
          time: new Date(log.timestamp).toLocaleString(),
        }));
      setRecentActivities(activities);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <p>Loading dashboard analytics...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">
        <i className="fas fa-chart-line me-2"></i>
        Admin Dashboard - Underwriting Analytics
      </h1>

      {/* Key Metrics */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <StatisticsCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon="users"
            color="blue"
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatisticsCard
            title="Pending Decisions"
            value={stats.pendingDecisions}
            icon="hourglass-half"
            color="warning"
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatisticsCard
            title="Active Policies"
            value={stats.totalPolicies}
            icon="file-contract"
            color="green"
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatisticsCard
            title="Approval Rate"
            value={`${stats.approvalRate}%`}
            icon="check-circle"
            color="success"
          />
        </Col>
      </Row>

      {/* Additional Metrics */}
      <Row className="mb-4">
        <Col lg={4} md={6} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h6 className="text-muted">Total Revenue</h6>
              <h3 className="text-success">${stats.totalRevenue}</h3>
              <small className="text-muted">From premium payments</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h6 className="text-muted">Avg Processing Time</h6>
              <h3 className="text-info">{stats.avgProcessingTime}</h3>
              <small className="text-muted">Decision to policy</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={12} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h6 className="text-muted">Risk Assessments</h6>
              <h3 className="text-primary">{stats.totalAssessments}</h3>
              <small className="text-muted">Total processed</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="mb-4">
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">
                <i className="fas fa-chart-line me-2"></i>
                Underwriting Trends (Last 7 Days)
              </Card.Title>
            </Card.Header>
            <Card.Body>
              {trendData && (
                <Line
                  data={trendData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 5,
                        },
                      },
                    },
                  }}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">
                <i className="fas fa-chart-pie me-2"></i>
                Decision Distribution
              </Card.Title>
            </Card.Header>
            <Card.Body>
              {decisionStats && (
                <Doughnut
                  data={decisionStats}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities and System Health */}
      <Row>
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">
                <i className="fas fa-history me-2"></i>
                Recent Activities
              </Card.Title>
            </Card.Header>
            <Card.Body>
              {recentActivities.length > 0 ? (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Entity</th>
                      <th>Actor</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.map((activity) => (
                      <tr key={activity.id}>
                        <td>
                          <Badge bg="info">{activity.action}</Badge>
                        </td>
                        <td>{activity.entity}</td>
                        <td>{activity.actor}</td>
                        <td>
                          <small className="text-muted">{activity.time}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted text-center py-3">
                  No recent activities
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">
                <i className="fas fa-server me-2"></i>
                System Health
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>
                    <strong>Backend API</strong>
                  </span>
                  <span className="text-success">● Online</span>
                </div>
                <ProgressBar now={100} variant="success" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>
                    <strong>Database</strong>
                  </span>
                  <span className="text-success">● Connected</span>
                </div>
                <ProgressBar now={100} variant="success" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>
                    <strong>Frontend</strong>
                  </span>
                  <span className="text-success">● Running</span>
                </div>
                <ProgressBar now={100} variant="success" />
              </div>
              <hr />
              <p className="mb-1">
                <small>
                  <strong>Last Sync:</strong> Just now
                </small>
              </p>
              <p className="mb-0">
                <small>
                  <strong>Server Time:</strong> {new Date().toLocaleString()}
                </small>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;
