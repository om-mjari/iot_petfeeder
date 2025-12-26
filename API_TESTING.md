# API Endpoints Testing Guide

## Base URL

```
http://localhost:5000/api
```

## 1. Health Check

### GET /health

```bash
curl http://localhost:5000/health
```

**Response:**

```json
{
  "success": true,
  "message": "🐾 Pet Feeder API is running",
  "timestamp": "2024-12-20T10:30:00.000Z",
  "environment": "development"
}
```

---

## 2. Authentication

### Register User

**POST /api/auth/register**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "petName": "Fluffy"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "6765abc123def456",
      "username": "testuser",
      "email": "test@example.com",
      "petName": "Fluffy"
    }
  }
}
```

### Login User

**POST /api/auth/login**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 3. Feeding Schedules (Requires Auth)

### Create Schedule

**POST /api/schedule/create**

```bash
curl -X POST http://localhost:5000/api/schedule/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "feedingTime": "08:00",
    "portionSize": "medium",
    "repeatDaily": true
  }'
```

### Get All Schedules

**GET /api/schedule/list**

```bash
curl http://localhost:5000/api/schedule/list \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Schedule

**PUT /api/schedule/update/:id**

```bash
curl -X PUT http://localhost:5000/api/schedule/update/6765abc123def456 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "isActive": false
  }'
```

### Delete Schedule

**DELETE /api/schedule/delete/:id**

```bash
curl -X DELETE http://localhost:5000/api/schedule/delete/6765abc123def456 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 4. Feeding Control (Requires Auth)

### Manual Feeding

**POST /api/feeding/activate**

```bash
curl -X POST http://localhost:5000/api/feeding/activate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "portionSize": "large"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Food dispensed successfully",
  "data": {
    "log": {
      "_id": "6765def789abc012",
      "userId": "6765abc123def456",
      "action": "Manual Feed",
      "status": "success",
      "portionSize": "large",
      "servoAngle": 135,
      "triggerType": "manual",
      "timestamp": "2024-12-20T10:35:00.000Z"
    },
    "servoCommand": {
      "action": "dispense",
      "angle": 135,
      "duration": 2000,
      "logId": "6765def789abc012"
    }
  }
}
```

### Stop Feeding

**POST /api/feeding/stop**

```bash
curl -X POST http://localhost:5000/api/feeding/stop \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Feeding Logs

**GET /api/feeding/logs**

```bash
curl "http://localhost:5000/api/feeding/logs?limit=10&page=1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get System Status

**GET /api/feeding/status**

```bash
curl http://localhost:5000/api/feeding/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "currentTime": "10:35",
    "activeSchedules": 2,
    "nextFeeding": {
      "_id": "6765abc123def456",
      "feedingTime": "14:00",
      "portionSize": "medium"
    },
    "lastActivity": {
      "action": "Manual Feed",
      "status": "success",
      "timestamp": "2024-12-20T10:35:00.000Z"
    },
    "systemStatus": "online"
  }
}
```

---

## Postman Collection

Import this JSON into Postman for easy testing:

```json
{
  "info": {
    "name": "Pet Feeder IoT API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "http://localhost:5000/api/auth/register",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"testuser\",\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\",\n  \"petName\": \"Fluffy\"\n}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "http://localhost:5000/api/auth/login",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 400 Bad Request

```json
{
  "success": false,
  "errors": [
    {
      "msg": "Password must be at least 6 characters",
      "param": "password"
    }
  ]
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Server error during registration"
}
```

---

## Testing Tips

1. **Save Token:** After login, copy the token for authenticated requests
2. **Replace YOUR_TOKEN_HERE:** Use the actual JWT token
3. **Check Response Status:** 200/201 = success, 4xx = client error, 5xx = server error
4. **Monitor Backend Logs:** Check terminal for detailed error messages
5. **Test Systematically:** Register → Login → Create Schedule → Activate Feeding → Check Logs

---

## PowerShell Examples

```powershell
# Register
$body = @{
    username = "testuser"
    email = "test@example.com"
    password = "password123"
    petName = "Buddy"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

# Login and save token
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody

$token = $response.data.token

# Use token for authenticated request
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/feeding/status" `
    -Method GET `
    -Headers $headers
```
