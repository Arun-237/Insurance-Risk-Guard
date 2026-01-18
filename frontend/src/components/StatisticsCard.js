import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import '../styles/StatisticsCard.css';

function StatisticsCard({ title, value, icon, color }) {
  return (
    <Card className={`stat-card stat-card-${color}`}>
      <Card.Body>
        <Row className="align-items-center">
          <Col xs="9">
            <div className="stat-info">
              <h6 className="stat-title">{title}</h6>
              <h3 className="stat-value">{value}</h3>
            </div>
          </Col>
          <Col xs="3" className="text-end">
            <i className={`fas fa-${icon} stat-icon`}></i>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default StatisticsCard;
