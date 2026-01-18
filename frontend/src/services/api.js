import axios from "axios";

const API_BASE_URL = "http://localhost:8082/api";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============ CUSTOMER APIs ============
export const getCustomers = () => api.get("/customers").then((res) => res.data);
export const getCustomer = (id) =>
  api.get(`/customers/${id}`).then((res) => res.data);
export const createCustomer = (customer) =>
  api.post("/customers", customer).then((res) => res.data);
export const updateCustomer = (id, customer) =>
  api.put(`/customers/${id}`, customer).then((res) => res.data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

// ============ RISK ASSESSMENT APIs ============
export const getRiskAssessments = () =>
  api.get("/risk-assessments").then((res) => res.data);
export const getRiskAssessment = (id) =>
  api.get(`/risk-assessments/${id}`).then((res) => res.data);
export const createRiskAssessment = (assessment) =>
  api.post("/risk-assessments", assessment).then((res) => res.data);
export const updateRiskAssessment = (id, assessment) =>
  api.put(`/risk-assessments/${id}`, assessment).then((res) => res.data);
export const updateRiskAssessmentStatus = (id, status) =>
  api
    .put(`/risk-assessments/${id}/status?status=${status}`)
    .then((res) => res.data);

// ============ UNDERWRITING DECISION APIs ============
export const getUnderwritingDecisions = () =>
  api.get("/underwriting-decisions").then((res) => res.data);
export const getUnderwritingDecision = (id) =>
  api.get(`/underwriting-decisions/${id}`).then((res) => res.data);
export const createUnderwritingDecision = (decision) =>
  api.post("/underwriting-decisions", decision).then((res) => res.data);
export const updateUnderwritingDecision = (id, decision) =>
  api.put(`/underwriting-decisions/${id}`, decision).then((res) => res.data);
export const deleteUnderwritingDecision = (id) =>
  api.delete(`/underwriting-decisions/${id}`);

// ============ POLICY APIs ============
export const getPolicies = () => api.get("/policies").then((res) => res.data);
export const getPolicy = (id) =>
  api.get(`/policies/${id}`).then((res) => res.data);
export const createPolicy = (policy) =>
  api.post("/policies", policy).then((res) => res.data);
export const updatePolicy = (id, policy) =>
  api.put(`/policies/${id}`, policy).then((res) => res.data);
export const getPoliciesByCustomer = (customerId) =>
  api.get(`/policies/customer/${customerId}`).then((res) => res.data);
export const deletePolicy = (id) => api.delete(`/policies/${id}`);

// ============ PREMIUM PAYMENT APIs ============
export const getPremiumPayments = () =>
  api.get("/premium-payments").then((res) => res.data);
export const getPremiumPayment = (id) =>
  api.get(`/premium-payments/${id}`).then((res) => res.data);
export const createPremiumPayment = (payment) =>
  api.post("/premium-payments", payment).then((res) => res.data);
export const updatePremiumPayment = (id, payment) =>
  api.put(`/premium-payments/${id}`, payment).then((res) => res.data);
export const getPremiumPaymentsByPolicy = (policyId) =>
  api.get(`/premium-payments/policy/${policyId}`).then((res) => res.data);

// ============ PREMIUM CALCULATION =========
export const calculatePremium = (coverageAmount, riskScore) =>
  api
    .get(`/premium/calculate`, {
      params: { coverageAmount, riskScore },
    })
    .then((res) => res.data);

// ============ RISK REPORT APIs ============
export const getRiskReports = () =>
  api.get("/risk-reports").then((res) => res.data);
export const createRiskReport = (report) =>
  api.post("/risk-reports", report).then((res) => res.data);
export const generateAnalyticsReport = () =>
  api.get("/risk-reports/analytics/summary").then((res) => res.data);

// ============ AUDIT LOG APIs ============
export const getAuditLogs = () =>
  api.get("/audit-logs").then((res) => res.data);

export default api;
