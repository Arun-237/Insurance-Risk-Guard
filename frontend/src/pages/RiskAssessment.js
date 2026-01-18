import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Badge, Table } from 'react-bootstrap';
import { getCustomers, createRiskAssessment, getRiskAssessments } from '../services/api';
import RiskAssessmentTable from '../components/RiskAssessmentTable';

function RiskAssessment() {
  const [customers, setCustomers] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [calculatedRisk, setCalculatedRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [assessing, setAssessing] = useState(false);

  useEffect(() => {
    fetchCustomersAndAssessments();
  }, []);

  const fetchCustomersAndAssessments = async () => {
    try {
      const customersData = await getCustomers();
      setCustomers(customersData);
      const assessmentsData = await getRiskAssessments();
      setAssessments(assessmentsData);
    } catch (err) {
      setError('Failed to load customers: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate risk based on customer data
  const calculateRiskScore = (customer) => {
    let riskScore = 50; // Base score
    let riskFactors = [];

    // Age factor (younger = higher risk for insurance)
    const age = new Date().getFullYear() - new Date(customer.dateOfBirth).getFullYear();
    if (age < 25) {
      riskScore += 20;
      riskFactors.push('Young age (< 25 years)');
    } else if (age < 35) {
      riskScore += 10;
      riskFactors.push('Relatively young age (25-35 years)');
    } else if (age > 65) {
      riskScore += 15;
      riskFactors.push('Senior age (> 65 years)');
    }

    // Insurance type factor
    if (customer.insuranceType === 'MOTOR') {
      riskScore += 15;
      riskFactors.push('Motor insurance (higher risk category)');
    } else if (customer.insuranceType === 'HEALTH') {
      riskScore += 5;
      riskFactors.push('Health insurance');
    } else if (customer.insuranceType === 'LIFE') {
      riskScore += 10;
      riskFactors.push('Life insurance');
    }

    // Document verification
    if (!customer.documentVerified) {
      riskScore += 20;
      riskFactors.push('Documents not verified');
    } else {
      riskScore -= 5;
      riskFactors.push('Documents verified (lower risk)');
    }

    // Contact information completeness
    let contactScore = 0;
    if (customer.email) contactScore++;
    if (customer.phone) contactScore++;
    if (customer.address && customer.city && customer.state) contactScore += 2;
    
    if (contactScore < 2) {
      riskScore += 15;
      riskFactors.push('Incomplete contact information');
    } else if (contactScore === 4) {
      riskScore -= 10;
      riskFactors.push('Complete contact information');
    }

    // Ensure score is between 0-100
    riskScore = Math.max(0, Math.min(100, riskScore));

    // Determine risk level
    let riskLevel;
    let result;
    if (riskScore <= 25) {
      riskLevel = 'LOW';
      result = 'APPROVED';
    } else if (riskScore <= 50) {
      riskLevel = 'MEDIUM';
      result = 'APPROVED';
    } else if (riskScore <= 75) {
      riskLevel = 'HIGH';
      result = 'REVIEW_REQUIRED';
    } else {
      riskLevel = 'CRITICAL';
      result = 'DECLINED';
    }

    return {
      riskScore: Math.round(riskScore),
      riskLevel,
      result,
      riskFactors
    };
  };

  const handleCustomerSelect = (e) => {
    const customerId = e.target.value;
    const customer = customers.find(c => c.customerId === parseInt(customerId));
    setSelectedCustomer(customer);
    
    if (customer) {
      const risk = calculateRiskScore(customer);
      setCalculatedRisk(risk);
    }
  };

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'danger';
      case 'CRITICAL': return 'dark';
      default: return 'secondary';
    }
  };

  const getResultBadgeColor = (result) => {
    switch (result) {
      case 'APPROVED': return 'success';
      case 'DECLINED': return 'danger';
      case 'REVIEW_REQUIRED': return 'warning';
      default: return 'secondary';
    }
  };

  const handleSubmitAssessment = async () => {
    if (!selectedCustomer || !calculatedRisk) {
      setError('Please select a customer first');
      return;
    }

    setAssessing(true);
    setError(null);
    setSuccess(null);

    try {
      const assessmentData = {
        customerId: selectedCustomer.customerId,
        riskScore: calculatedRisk.riskScore,
        riskLevel: calculatedRisk.riskLevel,
        assessmentDate: new Date().toISOString().split('T')[0],
        explanation: `Risk assessment based on customer profile analysis. Factors considered: ${calculatedRisk.riskFactors.join(', ')}`,
        rulesApplied: calculatedRisk.riskFactors.join('; '),
        result: calculatedRisk.result,
        flaggedForManualReview: calculatedRisk.result === 'REVIEW_REQUIRED'
      };

      await createRiskAssessment(assessmentData);
      setSuccess('Risk assessment completed and saved successfully!');
      setSelectedCustomer(null);
      setCalculatedRisk(null);
      fetchCustomersAndAssessments();
    } catch (err) {
      setError('Failed to save assessment: ' + err.message);
    } finally {
      setAssessing(false);
    }
  };

  if (loading) {
    return <Container className="py-5"><p>Loading...</p></Container>;
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Automated Risk Assessment</h1>
      
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">Select Customer to Assess</Card.Title>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form.Group className="mb-3">
                <Form.Label>Customer *</Form.Label>
                <Form.Select
                  value={selectedCustomer?.customerId || ''}
                  onChange={handleCustomerSelect}
                >
                  <option value="">Select a customer to assess...</option>
                  {customers.map(customer => (
                    <option key={customer.customerId} value={customer.customerId}>
                      {customer.name} - {customer.insuranceType} ({Math.floor((new Date().getFullYear() - new Date(customer.dateOfBirth).getFullYear()))} yrs)
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {selectedCustomer && (
                <Card className="bg-light">
                  <Card.Body>
                    <h6>Customer Profile:</h6>
                    <Table size="sm" className="mb-0">
                      <tbody>
                        <tr>
                          <td><strong>Name:</strong></td>
                          <td>{selectedCustomer.name}</td>
                        </tr>
                        <tr>
                          <td><strong>Insurance:</strong></td>
                          <td>{selectedCustomer.insuranceType}</td>
                        </tr>
                        <tr>
                          <td><strong>Age:</strong></td>
                          <td>{Math.floor((new Date().getFullYear() - new Date(selectedCustomer.dateOfBirth).getFullYear()))} years</td>
                        </tr>
                        <tr>
                          <td><strong>Email:</strong></td>
                          <td>{selectedCustomer.email || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td><strong>Phone:</strong></td>
                          <td>{selectedCustomer.phone || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td><strong>Documents:</strong></td>
                          <td>
                            <Badge bg={selectedCustomer.documentVerified ? 'success' : 'warning'}>
                              {selectedCustomer.documentVerified ? 'Verified' : 'Not Verified'}
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Location:</strong></td>
                          <td>{selectedCustomer.city}, {selectedCustomer.state} {selectedCustomer.zipCode}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          {calculatedRisk && (
            <Card>
              <Card.Header>
                <Card.Title className="mb-0">Risk Analysis Result</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="mb-4 text-center">
                  <h3 className="mb-2">Risk Score</h3>
                  <div style={{fontSize: '48px', fontWeight: 'bold', color: '#007bff'}}>
                    {calculatedRisk.riskScore}
                  </div>
                  <p className="text-muted">out of 100</p>
                </div>

                <div className="mb-4">
                  <h6>Risk Level:</h6>
                  <Badge bg={getRiskBadgeColor(calculatedRisk.riskLevel)} className="p-2" style={{fontSize: '16px'}}>
                    {calculatedRisk.riskLevel}
                  </Badge>
                </div>

                <div className="mb-4">
                  <h6>Recommendation:</h6>
                  <Badge bg={getResultBadgeColor(calculatedRisk.result)} className="p-2" style={{fontSize: '16px'}}>
                    {calculatedRisk.result}
                  </Badge>
                </div>

                <div className="mb-4">
                  <h6>Risk Factors:</h6>
                  <ul className="small">
                    {calculatedRisk.riskFactors.map((factor, idx) => (
                      <li key={idx}>{factor}</li>
                    ))}
                  </ul>
                </div>

                <Button 
                  variant="primary" 
                  onClick={handleSubmitAssessment}
                  disabled={assessing}
                  className="w-100"
                >
                  {assessing ? 'Saving...' : 'Save Assessment'}
                </Button>
              </Card.Body>
            </Card>
          )}
          
          {!calculatedRisk && (
            <Card className="bg-light">
              <Card.Body className="text-center">
                <p className="text-muted">Select a customer to see risk analysis</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <h3 className="mb-3">All Assessments</h3>
      <RiskAssessmentTable forReview={false} />
    </Container>
  );
}

export default RiskAssessment;
