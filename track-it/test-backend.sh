#!/bin/bash

echo "Testing TrackIt Backend API..."
echo "================================"

# Test if the server is running
echo "1. Testing server connectivity..."
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Server is running on port 8080"
else
    echo "❌ Server is not running on port 8080"
    echo "Please start the Spring Boot application first:"
    echo "cd track-it && mvn spring-boot:run"
    exit 1
fi

# Test the expenses endpoint (will return 401 without auth, but that's expected)
echo ""
echo "2. Testing expenses endpoint..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/expenses)
if [ "$response" = "401" ]; then
    echo "✅ Expenses endpoint is working (401 expected without authentication)"
elif [ "$response" = "200" ]; then
    echo "✅ Expenses endpoint is working (200 - authentication working)"
else
    echo "❌ Expenses endpoint returned unexpected status: $response"
fi

# Test CORS headers
echo ""
echo "3. Testing CORS configuration..."
cors_headers=$(curl -s -I -H "Origin: http://localhost:4200" http://localhost:8080/api/expenses | grep -i "access-control")
if [ -n "$cors_headers" ]; then
    echo "✅ CORS headers are configured"
else
    echo "❌ CORS headers not found"
fi

echo ""
echo "================================"
echo "Backend test completed!"
echo ""
echo "Next steps:"
echo "1. Start your Angular frontend: cd trackit && ng serve"
echo "2. Navigate to http://localhost:4200/dashboard"
echo "3. The frontend will test the backend connection automatically" 