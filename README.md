# Task Manager API with Role-Based Access Control

## Overview

This project is a full-stack Task Manager application built using FastAPI for the backend and React for the frontend. It enables users to register, authenticate, and manage tasks efficiently. The system includes role-based access control where users and administrators have different levels of permissions.

The application demonstrates REST API design, secure authentication, database integration, and frontend-backend communication.

---

## Features

### Authentication and Authorization
- User registration with secure password hashing
- Login using JWT (JSON Web Tokens)
- Role-based access control (User and Admin)
- Token-based request authentication

### Task Management (CRUD Operations)
- Create new tasks
- View tasks
- Update tasks
- Delete tasks
- Mark tasks as completed

### Role-Based Access
- Users can manage only their own tasks
- Admins can view and manage all tasks
- Admin-specific UI enhancements for task ownership visibility

### Frontend Integration
- React-based user interface
- API integration with backend services
- Dynamic UI updates based on user role
- Form handling for authentication and task operations

---

## Tech Stack

### Backend
- FastAPI
- Python
- MongoDB Atlas (Cloud Database)
- JWT Authentication
- Passlib (password hashing)

### Frontend
- React.js
- JavaScript
- Axios / Fetch API for HTTP requests

---

## Project Structure


project/
│
├── backend/
│ ├── routes/
│ │ ├── user_routes.py
│ │ └── task_routes.py
│ ├── auth.py
│ ├── database.py
│ ├── models.py
│ └── main.py
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── App.js
│ │ ├── api.js
│ │ └── components
│
├── .gitignore
└── README.md


---

## Setup Instructions

### Backend Setup

1. Navigate to backend folder:

cd backend


2. Create virtual environment:

python -m venv venv


3. Activate virtual environment:

venv\Scripts\activate


4. Install dependencies:

pip install -r requirements.txt


5. Create `.env` file and add:

MONGO_URL=your_mongodb_connection_string
SECRET_KEY=your_secret_key


6. Run backend server:

uvicorn main:app --reload


Backend runs on:
http://127.0.0.1:8000

---

### Frontend Setup

1. Navigate to frontend folder:

cd frontend


2. Install dependencies:

npm install


3. Start the application:

npm start


Frontend runs on:
http://localhost:3000

---

## API Documentation

Interactive API documentation is available using Swagger UI:

http://127.0.0.1:8000/docs

This interface allows:
- Testing all endpoints
- Viewing request/response formats
- Understanding API structure

---

## Database Schema

### Users Collection
- name
- email
- password (hashed)
- role (user/admin)

### Tasks Collection
- title
- description
- status (pending/completed)
- user_id
- user_email

---

## REST API Design

The backend follows REST principles:
- Proper HTTP methods (GET, POST, PUT, DELETE)
- Clear route structure
- JSON-based request and response handling
- Status codes for operation results

---

## Security Practices

- Password hashing using Passlib
- JWT-based authentication for secure access
- Protected routes using token verification
- Role validation for authorization control

---

## Scalability Considerations

This project is designed with scalability in mind and can be extended further for production-level systems.

### Microservices Architecture
- Backend modules can be separated into independent services (authentication service, task service)
- Each service can be deployed independently

### Caching
- Frequently accessed data (e.g., tasks) can be cached using Redis
- Reduces database load and improves performance

### Load Balancing
- Multiple backend instances can be deployed
- Load balancers (e.g., Nginx) can distribute traffic evenly
- Improves availability and fault tolerance

### Database Scaling
- MongoDB Atlas supports horizontal scaling
- Sharding and replication can be used for high availability

---

## Deployment Readiness

- Backend can be deployed using platforms like AWS, Render, or Docker
- Frontend can be deployed on Netlify or Vercel
- Environment variables are used for secure configuration

---

## Conclusion

This project demonstrates:
- Full-stack development
- Secure authentication and authorization
- REST API design and implementation
- Frontend-backend integration
- Scalable architecture principles