import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getRiskAssessments } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

function RiskDistributionChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchRiskDistribution();
  }, []);

  const fetchRiskDistribution = async () => {
    try {
      const assessments = await getRiskAssessments();
      const counts = {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
        CRITICAL: 0
      };

      assessments.forEach(a => {
        if (counts.hasOwnProperty(a.riskLevel)) {
          counts[a.riskLevel]++;
        }
      });

      setChartData({
        labels: ['Low', 'Medium', 'High', 'Critical'],
        datasets: [{
          data: [counts.LOW, counts.MEDIUM, counts.HIGH, counts.CRITICAL],
          backgroundColor: ['#28a745', '#ffc107', '#dc3545', '#343a40'],
          borderColor: ['#fff', '#fff', '#fff', '#fff'],
          borderWidth: 2
        }]
      });
    } catch (error) {
      console.error('Error fetching risk distribution:', error);
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title className="mb-0">Risk Distribution</Card.Title>
      </Card.Header>
      <Card.Body>
        {chartData ? (
          <div className="text-center">
            <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        ) : (
          <p>Loading chart...</p>
        )}
      </Card.Body>
    </Card>
  );
}

export default RiskDistributionChart;
