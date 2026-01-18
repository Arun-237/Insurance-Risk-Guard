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
  getPremiumPayments,
  createPremiumPayment,
  updatePremiumPayment,
  getPolicies,
  getCustomers,
} from "../services/api";
import "../styles/PremiumPayment.css";

function PremiumPayment() {
  const [payments, setPayments] = useState([]);
  const [policies, setPolicies] = useState({});
  const [customers, setCustomers] = useState({});
  const [allPolicies, setAllPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" or "record"
  const [formData, setFormData] = useState({
    customerId: "",
    policyId: "",
    amount: "",
    paymentDate: "",
    status: "UNPAID",
  });
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      console.log("Fetching premium payments...");
      const [paymentsData, policiesData, customersData] = await Promise.all([
        getPremiumPayments(),
        getPolicies(),
        getCustomers(),
      ]);

      console.log("Payments response:", paymentsData);
      console.log("Policies response:", policiesData);

      setPayments(Array.isArray(paymentsData) ? paymentsData : []);

      // Create policy map
      const policyMap = {};
      if (Array.isArray(policiesData)) {
        policiesData.forEach((p) => {
          policyMap[p.policyId] = p;
        });
      }
      setPolicies(policyMap);

      // Create customer map
      const customerMap = {};
      if (Array.isArray(customersData)) {
        customersData.forEach((c) => {
          customerMap[c.customerId] = c;
        });
      }
      setCustomers(customerMap);
      setAllPolicies(Array.isArray(policiesData) ? policiesData : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        url: err.config?.url,
      });
      setError(
        `Failed to load premium payments: ${err.message}. Is backend running on port 8080?`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = () => {
    setModalType("add");
    setFormData({
      customerId: "",
      policyId: "",
      amount: "",
      paymentDate: new Date().toISOString().split("T")[0],
      status: "UNPAID",
    });
    setShowModal(true);
  };

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    setFormData({
      ...formData,
      customerId: customerId,
      policyId: "", // Reset policy when customer changes
      amount: "",
    });
  };

  const getCustomerPolicies = () => {
    if (!formData.customerId) return [];
    return allPolicies.filter(
      (p) => p.customerId === parseInt(formData.customerId),
    );
  };

  const getCustomersWithPendingPayments = () => {
    // Get all customers that have unpaid payments
    const customersWithUnpaid = new Set();
    payments.forEach((payment) => {
      if (payment.status === "UNPAID") {
        const policy = policies[payment.policyId];
        if (policy) {
          customersWithUnpaid.add(policy.customerId);
        }
      }
    });
    return customersWithUnpaid;
  };

  const handleRecordPayment = (payment) => {
    setModalType("record");
    setSelectedPayment(payment);
    setFormData({
      policyId: payment.policyId,
      amount: payment.amount,
      paymentDate: new Date().toISOString().split("T")[0],
      status: "PAID",
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.policyId || !formData.amount) {
        setError("Please fill in all required fields");
        return;
      }

      if (modalType === "add") {
        await createPremiumPayment({
          policyId: parseInt(formData.policyId),
          amount: parseFloat(formData.amount),
          paymentDate: formData.paymentDate,
          status: formData.status,
        });
      } else if (modalType === "record") {
        await updatePremiumPayment(selectedPayment.paymentId, {
          ...selectedPayment,
          status: "PAID",
          paymentDate: formData.paymentDate,
        });
      }

      setShowModal(false);
      await fetchData();
      setError(null);
    } catch (err) {
      console.error("Error saving payment:", err);
      setError("Failed to save payment");
    }
  };

  const getStatusBadge = (status) => {
    return (
      <Badge bg={status === "PAID" ? "success" : "warning"}>{status}</Badge>
    );
  };

  const calculateStats = () => {
    const totalPayments = payments.length;
    const paidPayments = payments.filter((p) => p.status === "PAID").length;
    const unpaidPayments = payments.filter((p) => p.status === "UNPAID").length;
    const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const paidAmount = payments
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    return {
      totalPayments,
      paidPayments,
      unpaidPayments,
      totalAmount,
      paidAmount,
    };
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <p>Loading premium payments...</p>
        </div>
      </Container>
    );
  }

  const stats = calculateStats();
  const unpaidPayments = payments.filter((p) => p.status === "UNPAID");
  const paidPayments = payments.filter((p) => p.status === "PAID");

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Premium Payments</h1>
        <Button variant="primary" onClick={handleAddPayment}>
          <i className="fas fa-plus"></i> Add Payment
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h3>{stats.totalPayments}</h3>
              <p>Total Payments</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card stat-paid">
            <Card.Body className="text-center">
              <h3>{stats.paidPayments}</h3>
              <p>Paid Payments</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card stat-unpaid">
            <Card.Body className="text-center">
              <h3>{stats.unpaidPayments}</h3>
              <p>Unpaid Payments</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h3>${stats.totalAmount.toFixed(2)}</h3>
              <p>Total Amount</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {unpaidPayments.length > 0 && (
        <Card className="mb-4 unpaid-section">
          <Card.Header className="bg-warning">
            <Card.Title className="mb-0">
              Outstanding Payments ({unpaidPayments.length})
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Policy ID</th>
                  <th>Customer Name</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Days Overdue</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {unpaidPayments.map((payment) => {
                  const policy = policies[payment.policyId];
                  const dueDate = new Date(payment.paymentDate);
                  const today = new Date();
                  const daysOverdue = Math.floor(
                    (today - dueDate) / (1000 * 60 * 60 * 24),
                  );

                  return (
                    <tr key={payment.paymentId}>
                      <td>{payment.paymentId}</td>
                      <td>
                        <strong>{payment.policyId}</strong>
                      </td>
                      <td>{customers[policy?.customerId]?.name || "N/A"}</td>
                      <td>${payment.amount?.toFixed(2) || "0.00"}</td>
                      <td>{payment.paymentDate || "N/A"}</td>
                      <td>{getStatusBadge(payment.status)}</td>
                      <td>
                        {daysOverdue > 0 ? (
                          <Badge bg="danger">{daysOverdue} days</Badge>
                        ) : (
                          <span className="text-muted">Due</span>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleRecordPayment(payment)}
                        >
                          <i className="fas fa-check"></i> Record Payment
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {paidPayments.length > 0 && (
        <Card>
          <Card.Header>
            <Card.Title className="mb-0">
              Payment History ({paidPayments.length})
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Policy ID</th>
                  <th>Customer Name</th>
                  <th>Amount</th>
                  <th>Payment Date</th>
                  <th>Status</th>
                  <th>Days Since Payment</th>
                </tr>
              </thead>
              <tbody>
                {paidPayments.map((payment) => {
                  const policy = policies[payment.policyId];
                  const paymentDate = new Date(payment.paymentDate);
                  const today = new Date();
                  const daysSince = Math.floor(
                    (today - paymentDate) / (1000 * 60 * 60 * 24),
                  );

                  return (
                    <tr key={payment.paymentId}>
                      <td>{payment.paymentId}</td>
                      <td>
                        <strong>{payment.policyId}</strong>
                      </td>
                      <td>{customers[policy?.customerId]?.name || "N/A"}</td>
                      <td>${payment.amount?.toFixed(2) || "0.00"}</td>
                      <td>{payment.paymentDate || "N/A"}</td>
                      <td>{getStatusBadge(payment.status)}</td>
                      <td>{daysSince} days ago</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {payments.length === 0 && (
        <Card>
          <Card.Body className="text-center text-muted p-5">
            <p>No premium payments found.</p>
          </Card.Body>
        </Card>
      )}

      {/* Payment Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "add" ? "Add Premium Payment" : "Record Payment"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Customer *</Form.Label>
              <Form.Select
                value={formData.customerId}
                onChange={handleCustomerChange}
                disabled={modalType === "record"}
              >
                <option value="">Select a customer</option>
                {Object.values(customers)
                  .filter((customer) =>
                    getCustomersWithPendingPayments().has(customer.customerId),
                  )
                  .map((customer) => (
                    <option
                      key={customer.customerId}
                      value={customer.customerId}
                    >
                      {customer.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Policy ID *</Form.Label>
              <Form.Select
                value={formData.policyId}
                onChange={(e) =>
                  setFormData({ ...formData, policyId: e.target.value })
                }
                disabled={modalType === "record" || !formData.customerId}
              >
                <option value="">
                  {!formData.customerId
                    ? "Select a customer first"
                    : "Select a policy"}
                </option>
                {getCustomerPolicies().map((policy) => (
                  <option key={policy.policyId} value={policy.policyId}>
                    Policy #{policy.policyId} - ₹
                    {policy.premiumAmount?.toFixed(2) || "0.00"}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount (₹) *</Form.Label>
              <Form.Control
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="0.00"
                disabled={modalType === "record"}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                {modalType === "add" ? "Due Date" : "Payment Date"} *
              </Form.Label>
              <Form.Control
                type="date"
                value={formData.paymentDate}
                onChange={(e) =>
                  setFormData({ ...formData, paymentDate: e.target.value })
                }
              />
            </Form.Group>

            {modalType === "add" && (
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="UNPAID">Unpaid</option>
                  <option value="PAID">Paid</option>
                </Form.Select>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant={modalType === "add" ? "primary" : "success"}
            onClick={handleSubmit}
          >
            {modalType === "add" ? "Add Payment" : "Record Payment"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PremiumPayment;
