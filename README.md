# Quiz Application

## Project Description
This is a quiz application consisting of a backend API and a frontend React client. The backend is built with Node.js, Express, and MongoDB, providing RESTful API endpoints for managing quiz questions, user authentication, and storing quiz results. The backend also integrates the Sambanova API to generate quiz questions dynamically. The frontend is a React application built with Vite, providing an interactive user interface for taking quizzes and viewing results.

## Routes
The backend API exposes the following routes:

- **GET /questions**: Retrieve all quiz questions.
- **POST /questions**: Insert new quiz questions.
- **DELETE /questions**: Delete all quiz questions.
- **GET /result**: Retrieve quiz results.
- **POST /result**: Store a new quiz result.
- **DELETE /result**: Delete all quiz results.
- **POST /auth/register**: Register a new user.
- **POST /auth/login**: Login an existing user.
- **POST /questions/generate**: Generate quiz questions by topic.

## How to Clone
Clone the repository using the following command:

```bash
git clone <repository-url>
```

Replace `<repository-url>` with the actual URL of this repository.

## How to Run

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run script
   ```
   This runs the server using nodemon on `server.js`.

### Frontend
1. Navigate to the frontend directory:
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
4. Open your browser and go to `http://localhost:3000` (or the port shown in the terminal) to use the application.

---

Feel free to contribute or raise issues for improvements.
