# Event Management Dashboard

A complete full-stack event management application built with React, Spring Boot, and MongoDB.

## Features

- **Role-based Dashboards:** Dedicated dashboards for Event Organizers and Users (Attendees).
- **Authentication:** Secure JWT-based authentication and BCrypt password encryption.
- **Event Creation:** Organizers can create events with specific dates, locations, and participant limits.
- **Real-time Registration Counter:** Uses WebSockets (SockJS + STOMP) to push live updates of event registration counts to Organizers and Users without reloading.
- **Responsive UI:** Modern, responsive UI built with Tailwind CSS.

## Prerequisites

- **Java 17+**
- **Node.js (v16+)**
- **MongoDB Database:** Running on `localhost:27017`

## How to Run the Backend (Spring Boot)

1. Make sure MongoDB is running on `mongodb://localhost:27017/eventmgmt`.
2. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(On Windows, use `mvnw.cmd spring-boot:run`)*

The backend will start on `http://localhost:8080`.

## How to Run the Frontend (React + Vite)

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:5173`. Make sure the Spring Boot backend is already running so APIs are reachable.

## Testing the Application

1. Open `http://localhost:5173`.
2. Register a new user and select the role **ORGANIZER**. Login to the Organizer dashboard.
3. Create a new event.
4. Sign out and register another user as **USER**.
5. Browse the events and click "Register Now". 
6. By keeping the Organizer dashboard open in another browser or tab, you will see the registration count update instantly in real-time when the attendee registers!
