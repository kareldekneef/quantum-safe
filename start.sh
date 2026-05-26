#!/bin/bash
# Quantum-Safe Microsite Startup Script

cd "$(dirname "$0")"

echo "Starting Quantum-Safe Microsite..."
echo ""

# Check if node is available
if command -v node &> /dev/null; then
    NODE_CMD="node"
elif [ -f "/opt/homebrew/bin/node" ]; then
    NODE_CMD="/opt/homebrew/bin/node"
elif [ -f "/usr/local/bin/node" ]; then
    NODE_CMD="/usr/local/bin/node"
else
    echo "Error: Node.js not found. Please install Node.js first."
    exit 1
fi

# Kill any existing process on port 8080
lsof -ti:8080 | xargs kill -9 2>/dev/null

# Start the server
$NODE_CMD server.js
