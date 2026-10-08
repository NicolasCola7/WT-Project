# Selfie

A **full-stack** web app to organise a university student's life: calendar, study timer, notes and an AI-powered assistant.
Project for the Web Technologies course, BSc in Computer Science for Management, University of Bologna (2025).

**Full setup guide (in Italian):** [README_TW-Project.pdf](README_TW-Project.pdf)

## Features

- **Calendar** with one-off and recurring events, import and export (iCal, Google Calendar)
- **Pomodoro timer** to organise study sessions
- **Notes** with Markdown and LaTeX formula support
- **Time Machine** to simulate different dates and test the app
- **AI assistant** built on the OpenAI API
- **Sign-up and login** with JWT authentication

## Technologies

| Part | Technologies |
| --- | --- |
| Front end | Angular 19, TypeScript, Angular Material, Bootstrap, FullCalendar |
| Back end | Node.js, Express, Mongoose, JWT |
| Database | MongoDB |
| Artificial intelligence | OpenAI API |

## How to run it

1. Install the dependencies from the main folder:

        npm install

2. Create the `server/.env` file with these variables:

        PORT=3000
        MONGODB_URI=mongodb://localhost:27017/selfie
        JWT_SECRET=a-long-random-string
        API_KEY=your-openai-key

3. Start the application:

        npm run start

4. Open http://localhost:4200 in your browser.

The repository also includes `mongodump_root_folder.zip` with sample data to import into MongoDB: the steps are in the PDF guide.

## Team

Matteo Boscherini, Alessandro Campedelli, Nicolas Cola
