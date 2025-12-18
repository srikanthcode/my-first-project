# Backend Service

This is the Spring Boot backend for the WhatsApp Clone.

## Prerequisites
- Java 17+
- Maven 3.6+

## Configuration
Edit `src/main/resources/application.properties`:
```properties
spring.mail.username=YOUR_REAL_EMAIL@gmail.com
spring.mail.password=YOUR_APP_PASSWORD
```

## Running
To start the backend server:
```bash
mvn spring-boot:run
```

The server will start on port 8080.
API Endpoint: `POST http://localhost:8080/api/auth/send-otp`
Body: `{"email": "user@example.com"}`
