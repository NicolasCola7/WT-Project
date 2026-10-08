# Selfie

Web app **full-stack** per organizzare la vita di uno studente universitario: calendario, timer di studio, note e un assistente basato sull'intelligenza artificiale.
Progetto del corso di Tecnologie Web, Laurea Triennale in Informatica per il Management, Università di Bologna (2025).

📄 **Guida completa all'avvio:** [README_TW-Project.pdf](README_TW-Project.pdf)

## Funzionalità

- **Calendario** con eventi singoli e ricorrenti, importazione ed esportazione (iCal, Google Calendar)
- **Timer Pomodoro** per organizzare le sessioni di studio
- **Note** con supporto a Markdown e formule LaTeX
- **Time Machine** per simulare date diverse e testare l'app
- **Assistente AI** basato sulle API di OpenAI
- **Registrazione e login** con autenticazione JWT

## Tecnologie

| Parte | Tecnologie |
| --- | --- |
| Front-end | Angular 19, TypeScript, Angular Material, Bootstrap, FullCalendar |
| Back-end | Node.js, Express, Mongoose, JWT |
| Database | MongoDB |
| Intelligenza artificiale | OpenAI API |

## Come avviarlo

1. Installa le dipendenze dalla cartella principale:

        npm install

2. Crea il file `server/.env` con queste variabili:

        PORT=3000
        MONGODB_URI=mongodb://localhost:27017/selfie
        JWT_SECRET=una-stringa-lunga-e-casuale
        API_KEY=la-tua-chiave-openai

3. Avvia l'applicazione:

        npm run start

4. Apri http://localhost:4200 nel browser.

Nella repo c'è anche `mongodump_root_folder.zip` con dati di esempio da importare in MongoDB: i passaggi sono nella guida PDF.

## Gruppo

Matteo Boscherini, Alessandro Campedelli, Nicolas Cola
