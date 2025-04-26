#!/bin/bash

# PDF Conversion and Merger Tool Startup Script

echo "Starting PDF Conversion and Merger Tool..."

# Check if LibreOffice is installed
if ! command -v libreoffice &> /dev/null; then
    echo "LibreOffice is not installed, which is required for document conversion."
    echo "Please install LibreOffice and try again."
    exit 1
fi

# Determine the project root directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Start backend server
echo "Starting Go backend server..."
cd "$PROJECT_ROOT/backend"
go run main.go &
BACKEND_PID=$!

# Wait a moment to ensure the backend is starting up
sleep 2

# Start frontend development server
echo "Starting React frontend server..."
cd "$PROJECT_ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

# Display startup information
echo ""
echo "PDF Conversion and Merger Tool is running!"
echo "----------------------------------------"
echo "Backend API: http://localhost:8080"
echo "Frontend UI: http://localhost:5173"
echo "----------------------------------------"
echo "Press Ctrl+C to stop both servers"
echo ""

# Handle graceful shutdown
function cleanup {
  echo ""
  echo "Shutting down servers..."
  kill $BACKEND_PID $FRONTEND_PID
  wait $BACKEND_PID 2>/dev/null
  wait $FRONTEND_PID 2>/dev/null
  echo "Servers stopped"
  exit 0
}

trap cleanup INT TERM

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID