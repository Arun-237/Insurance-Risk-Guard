# Script to load sample data into RiskGuard via REST API
$baseUrl = "http://localhost:8082/api"

Write-Host "Loading sample customers..." -ForegroundColor Green

# Create Customers
$customers = @(
    @{ name = "John Doe"; dateOfBirth = "1985-05-15"; email = "john.doe@email.com"; phone = "555-0101"; insuranceType = "HEALTH"; address = "123 Main St"; city = "New York"; state = "NY"; zipCode = "10001"; documentVerified = $true },
    @{ name = "Jane Smith"; dateOfBirth = "1990-03-22"; email = "jane.smith@email.com"; phone = "555-0102"; insuranceType = "LIFE"; address = "456 Oak Ave"; city = "Los Angeles"; state = "CA"; zipCode = "90001"; documentVerified = $true },
    @{ name = "Bob Johnson"; dateOfBirth = "1978-07-10"; email = "bob.johnson@email.com"; phone = "555-0103"; insuranceType = "MOTOR"; address = "789 Pine Rd"; city = "Chicago"; state = "IL"; zipCode = "60601"; documentVerified = $false },
    @{ name = "Alice Williams"; dateOfBirth = "1992-11-30"; email = "alice.w@email.com"; phone = "555-0104"; insuranceType = "HEALTH"; address = "321 Elm St"; city = "Houston"; state = "TX"; zipCode = "77001"; documentVerified = $true },
    @{ name = "Charlie Brown"; dateOfBirth = "1988-02-14"; email = "charlie.b@email.com"; phone = "555-0105"; insuranceType = "LIFE"; address = "654 Maple Dr"; city = "Phoenix"; state = "AZ"; zipCode = "85001"; documentVerified = $true }
)

$createdCustomers = @()
foreach ($customer in $customers) {
    $json = $customer | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/customers" -Method Post -Body $json -ContentType "application/json"
    $createdCustomers += $response
    Write-Host "Created customer: $($response.name) (ID: $($response.customerId))" -ForegroundColor Cyan
}

Write-Host "`nLoading risk assessments..." -ForegroundColor Green

# Create Risk Assessments
$assessments = @(
    @{ customerId = $createdCustomers[0].customerId; riskScore = 45.5; riskLevel = "LOW"; rulesApplied = "Age: OK, Health: OK, Claims: None"; result = "APPROVED"; flaggedForManualReview = $false },
    @{ customerId = $createdCustomers[1].customerId; riskScore = 65.3; riskLevel = "MEDIUM"; rulesApplied = "Age: OK, Health: Minor Issue"; result = "REVIEW_REQUIRED"; flaggedForManualReview = $true },
    @{ customerId = $createdCustomers[2].customerId; riskScore = 78.9; riskLevel = "HIGH"; rulesApplied = "Age: OK, Driving Record: Poor"; result = "REVIEW_REQUIRED"; flaggedForManualReview = $true },
    @{ customerId = $createdCustomers[3].customerId; riskScore = 35.2; riskLevel = "LOW"; rulesApplied = "Age: OK, Health: OK, Claims: None"; result = "APPROVED"; flaggedForManualReview = $false },
    @{ customerId = $createdCustomers[4].customerId; riskScore = 88.7; riskLevel = "CRITICAL"; rulesApplied = "Age: High, Health: Serious Issues"; result = "DECLINED"; flaggedForManualReview = $true }
)

$createdAssessments = @()
foreach ($assessment in $assessments) {
    $json = $assessment | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/risk-assessments" -Method Post -Body $json -ContentType "application/json"
    $createdAssessments += $response
    Write-Host "Created assessment for customer $($assessment.customerId): Risk Level $($assessment.riskLevel)" -ForegroundColor Cyan
}

Write-Host "`nLoading underwriting decisions..." -ForegroundColor Green

# Create Underwriting Decisions
$decisions = @(
    @{ customerId = $createdCustomers[0].customerId; assessmentId = $createdAssessments[0].assessmentId; status = "APPROVED"; reason = "Low risk profile"; decidedBy = "John Underwriter" },
    @{ customerId = $createdCustomers[1].customerId; assessmentId = $createdAssessments[1].assessmentId; status = "PENDING"; reason = "Awaiting additional documents"; decidedBy = "Jane Reviewer" },
    @{ customerId = $createdCustomers[2].customerId; assessmentId = $createdAssessments[2].assessmentId; status = "ON_HOLD"; reason = "Requires clarification on driving history"; decidedBy = "Bob Reviewer" },
    @{ customerId = $createdCustomers[3].customerId; assessmentId = $createdAssessments[3].assessmentId; status = "APPROVED"; reason = "Excellent health record"; decidedBy = "John Underwriter" },
    @{ customerId = $createdCustomers[4].customerId; assessmentId = $createdAssessments[4].assessmentId; status = "DECLINED"; reason = "Pre-existing conditions exclude coverage"; decidedBy = "Jane Reviewer" }
)

foreach ($decision in $decisions) {
    $json = $decision | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/underwriting-decisions" -Method Post -Body $json -ContentType "application/json"
    Write-Host "Created decision for customer $($decision.customerId): Status $($decision.status)" -ForegroundColor Cyan
}

Write-Host "`n✓ Sample data loaded successfully!" -ForegroundColor Green
Write-Host "Now refresh your browser at http://localhost:3000" -ForegroundColor Yellow
