#!/bin/bash
# RiskGuard Backend Startup Script for Mac/Linux

echo ""
echo "========================================"
echo "RiskGuard Backend Startup"
echo "========================================"
echo ""

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "Current directory: $(pwd)"

# Check if pom.xml exists
if [ ! -f "pom.xml" ]; then
    echo "ERROR: pom.xml not found in $(pwd)"
    exit 1
fi

# Find Maven
if command -v mvn &> /dev/null; then
    MVN_CMD="mvn"
elif [ -f "$HOME/.maven/maven-3.9.12/bin/mvn" ]; then
    MVN_CMD="$HOME/.maven/maven-3.9.12/bin/mvn"
else
    echo "ERROR: Maven not found!"
    echo "Please install Maven first."
    exit 1
fi

echo ""
echo "Starting Maven build and Spring Boot..."
echo ""

# Run Maven Spring Boot
"$MVN_CMD" spring-boot:run

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Application failed to start"
    exit 1
fi
