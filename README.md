# Task Manager API (Full Stack)

## Overview
A full-stack Task Manager application built using FastAPI (backend) and React (frontend). The system supports secure user authentication using JWT and implements role-based access control where users manage their own tasks and admins can manage all tasks.

---

## Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Password hashing for secure storage
- Role-based access control (User / Admin)

### Task Management (CRUD)
- Create, view, update, and delete tasks
- Mark tasks as completed
- Users can access only their own tasks
- Admin can view and manage all tasks

### Frontend Integration
- React-based user interface
- API integration with backend services
- Dynamic UI rendering based on user role

---

## Tech Stack

**Backend**
- FastAPI (Python)
- MongoDB Atlas
- JWT Authentication
- Passlib (password hashing)

**Frontend**
- React.js
- JavaScript

---
## Project Structure

project/
├── backend/
│ ├── routes/
│ │ ├── user_routes.py
│ │ └── task_routes.py
│ ├── auth.py
│ ├── database.py
│ ├── models.py
│ └── main.py
├── frontend/
│ ├── public/
│ └── src/
├── .gitignore
└── README.md

---

## Setup Instructions

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

Backend runs on: http://127.0.0.1:8000

Frontend Setup
cd frontend
npm install
npm start

Frontend runs on: http://localhost:3000

## API Documentation

Interactive API documentation is available via Swagger UI:  
http://127.0.0.1:8000/docs

---

## Database Schema

### Users
- name  
- email  
- password (hashed)  
- role  

### Tasks
- title  
- description  
- status  
- user_id  
- user_email  

---

## REST API Design

- Follows REST principles  
- Uses HTTP methods: GET, POST, PUT, DELETE  
- JSON-based request and response handling  
- Proper status codes for responses  

---

## Security Practices

- JWT-based authentication  
- Password hashing using Passlib  
- Protected routes with token validation  
- Role-based authorization checks  

---

## Scalability Considerations

- **Microservices**: Backend can be split into independent services such as authentication and task management  
- **Caching**: Redis can be introduced to cache frequently accessed data and improve performance  
- **Load Balancing**: Multiple backend instances can be deployed with a load balancer to handle high traffic  
- **Database Scaling**: MongoDB Atlas supports horizontal scaling, replication, and high availability  

---

## Deployment Readiness

- Backend can be deployed using cloud platforms such as AWS, Render, or Docker  
- Frontend can be deployed on platforms like Netlify or Vercel  
- Environment variables are used for secure configuration  

---

## Conclusion

This project demonstrates full-stack development with secure authentication, role-based access control, REST API design, and scalable architecture principles.

## Project Structure
