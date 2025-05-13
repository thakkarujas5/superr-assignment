# Superr Assignment

A robust backend API service for managing quizzes, student responses, and generating performance reports. This system supports multiple user roles (Teacher, Student, Admin).

## Features

- User authentication and authorization with JWT
- Session management for educational classes
- Real-time heartbeat tracking for student engagement
- Quiz creation and management
- Student answer submission and tracking
- Performance reporting and analytics
- Role-based access control (Teacher, Student, Admin)


## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/thakkarujas5/superr-assignment.git
cd superr-assignment
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

4. Set up the database:
- Create a MySQL database
- Run the migration script located in `migrations/001-init.sql`

5. Start the server:
```bash
node server.js
```

The server will start running on port 5005.

## API Documentation

You can access the Swagger API documentation at [API](http://localhost:5005/api-docs).

Can only be accessed when the service is running currently.

## API Endpoints

### Authentication

#### POST /auth/v1/signup
- Creates a new user account
- Required fields: username, password, roles (array)
- Roles can be: ['TEACHER', 'STUDENT', 'ADMIN']

#### POST /auth/v1/login
- Authenticates user and returns JWT token
- Required fields: username, password

### Session Management

#### POST /events/v1/session
- Manages session events (start/end)
- Required fields: event_type, school_id, class_id, timestamp
- Event types: "SESSION_STARTED", "SESSION_ENDED"
- Authorization: Teacher role required

### Heartbeat Tracking

#### POST /events/v1/heartbeat
- Tracks student engagement during sessions
- Required fields: session_id, event_type, student_id
- Authorization: Teacher or Student role required

### Quiz Management

#### POST /events/v1/answer
- Submits student answers for quiz questions
- Required fields: quiz_id, question_id, student_id, result, timestamp, duration
- Authorization: Student role required

### Reports

#### GET /reports/v1/student
- Retrieves student performance reports
- Authorization: Teacher or Admin role required

#### GET /reports/v1/classroom
- Retrieves classroom engagement report
- Shows metrics like average hours revisiting, students taking notes, and quiz participation
- Authorization: Teacher or Admin role required

#### GET /reports/v1/content
- Retrieves content effectiveness report
- Shows metrics like content creation percentage, quiz participation, and response times
- Authorization: Teacher or Admin role required

## Database Schema

The system uses the following main tables:
- Users
- Sessions
- Session_Heartbeats
- Quiz
- Question
- Answers
- ReportCache

## Error Handling

The API implements standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security

- JWT-based authentication
- Role-based access control
- Password hashing (to be implemented)
- Environment variable configuration
- Input validation


