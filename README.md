# Loop: The Smart Email Reply Assistant

Loop is a full-stack application that generates smart email replies using AI. It includes a Spring Boot backend, a React frontend, and browser extensions for Chrome and Firefox.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Browser Extensions](#browser-extensions)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

- Generate AI-powered email replies.
- Easy-to-use web interface.
- Chrome and Firefox browser extensions for quick access.
- Configurable backend API and environment variables.

---

## Project Structure

```
loop-backend/           # Spring Boot backend
loop-frontend/          # React frontend (Vite)
email-writer-ext/       # Chrome extension
email-writer-ext-firefox/ # Firefox extension
scripts/                # Utility scripts
```

---

## Setup Instructions

### Backend

1. **Requirements:** Java 17+, Maven
2. **Configuration:**  
   Edit `src/main/resources/application.properties` for environment variables (e.g., Gemini API key, model URL).
3. **Run the backend:**
   ```bash
   cd loop-backend
   ./mvnw spring-boot:run
   ```
   The backend will start on [http://localhost:8080](http://localhost:8080).

### Frontend

1. **Requirements:** Node.js 18+, npm
2. **Install dependencies:**
   ```bash
   cd loop-frontend
   npm install
   ```
3. **Run the frontend:**
   ```bash
   npm run dev
   ```
   The frontend will be available at [http://localhost:5173](http://localhost:5173) (default Vite port).

### Browser Extensions

#### Chrome

1. Go to `chrome://extensions/`.
2. Enable "Developer mode".
3. Click "Load unpacked" and select the `email-writer-ext` folder.

#### Firefox

1. Go to `about:debugging#/runtime/this-firefox`.
2. Click "Load Temporary Add-on" and select the `manifest.json` in `email-writer-ext-firefox`.

**Note:** Both extensions require the backend to be running at `http://localhost:8080`.

---

## API Reference

### Generate Email Reply

- **Endpoint:** `POST /api/email/generate`
- **Request Body:**  
  ```json
  {
    "subject": "string",
    "body": "string",
    "sender": "string"
  }
  ```
- **Response:**  
  `200 OK` with generated reply as plain text.

---

## Environment Variables

Configure your Gemini API key and model URL in `application.properties`:

```
GEMINI_API_KEY=your_api_key
GEMINI_MODEL_URL=https://your-model-url
```

---

## Troubleshooting

- **Backend not running:**  
  Ensure you have Java and Maven installed. Check for port conflicts on 8080.
- **Frontend not connecting:**  
  Make sure the backend is running and accessible at `http://localhost:8080`.
- **Extension issues:**  
  - Chrome works but Firefox does not: Check CORS settings and permissions in `manifest.json`.
  - "Cannot connect to backend server": Ensure backend is running and accessible.
- **CORS:**  
  The backend allows all origins via `@CrossOrigin(origins="*")`.

---

## License

This project is licensed under the MIT License.

---

Feel free to modify this README to fit your specific needs!

