# TaskFlow

A simple task management application for creating, managing, and tracking daily tasks.

## Live Demo

https://taskflow-azure-omega.vercel.app/

## Features

- Create new tasks
- View existing tasks
- Update task details
- Delete tasks
- Mark tasks as completed
- Simple and responsive interface
- Task data management through the application

## Tech Stack

### Frontend
- React
- JavaScript
- HTML
- CSS

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB

### Deployment
- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

## CRUD Operations

TaskFlow supports the basic CRUD operations:

| Operation | Method | Purpose |
|---|---|---|
| Create | POST | Add a new task |
| Read | GET | View tasks |
| Update | PUT | Edit a task |
| Delete | DELETE | Remove a task |

## How It Works

```text
User
  ↓
Frontend
  ↓
REST API
  ↓
Backend
  ↓
MongoDB
  ↓
Backend
  ↓
Frontend
```

The frontend sends requests to the backend API. The backend processes the request and communicates with MongoDB to store or retrieve task data.


## Deployment

The application is deployed using:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

The production frontend communicates with the deployed backend through the API.

## Future Improvements

- User authentication
- Task filtering and sorting
- Due dates and reminders
- Task categories
- Search functionality
- Better mobile experience

## Author

Komal Shirke
