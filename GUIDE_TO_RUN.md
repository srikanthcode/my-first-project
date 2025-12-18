# How to Run the Full Stack Application

## 1. Backend (Spring Boot)
The backend handles Email OTP, User Registration, and Real-time Chat.

1.  **Prerequisite**: Install Java 17+ and Maven.
2.  **Configuration**: 
    - Open `backend/src/main/resources/application.properties`.
    - Update `spring.mail.username` and `spring.mail.password` with your Gmail credentials.
3.  **Run**:
    - Double click `run_backend.bat` in the root folder.
    - OR run manually:
      ```bash
      cd backend
      mvn spring-boot:run
      ```
    - Server starts at `http://localhost:8080`.

## 2. Frontend (Next.js)
The frontend is the user interface.

1.  **Install Dependencies**:
    ```bash
    npm install
    npm install @stomp/stompjs sockjs-client
    npm install --save-dev @types/sockjs-client
    ```
2.  **Run**:
    ```bash
    npm run dev
    ```
    - app starts at `http://localhost:3000`.

## 3. Usage Flow
1.  Open `http://localhost:3000/auth/login`.
2.  Enter Email -> Click "Send OTP".
3.  Check Console/Email for OTP (In demo mode it might log to backend console if email fails).
4.  Once logged in, go to Chat.
5.  Connecting to `ws://localhost:8080/ws` happens automatically.
6.  Send messages!
