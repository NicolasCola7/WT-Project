import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path, { join as pathJoin, resolve } from 'path';
import { connectToMongo } from './mongo';
import setRoutes from './routes';
import { upload } from './multer.config';

const envPath = resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const app = express();
app.use(express.json());
app.use(express.text());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.urlencoded({ extended: false }));
app.set('port', (process.env.PORT || 3000));


setRoutes(app);

app.post('/api/uploads', (req, res, next) => {
  // First parse the request to get the destination
  express.json()(req, res, (err) => {
    if (err) {
      return next(err);
    }
    
    // Now process the file with the destination from the body
    upload.single('calendar')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      
      // Return the file path
      res.sendStatus(200);
    });
  });
});

app.get('/api/uploads/:userId/:filename', (req, res) => {
  const { userId, filename } = req.params;
  const filePath = path.join(__dirname, '..', 'uploads', userId, filename);
  
  
  // Check if the path exists and if it's a file (not a directory)
  const fs = require('fs');
  fs.stat(filePath, (err: any, stats: { isFile: () => any; }) => {
    if (err) {
      console.error('File stat error:', err);
      return res.status(404).send('File not found');
    }

    if (!stats.isFile()) {
      console.error('Path exists but is not a file:', filePath);
      return res.status(400).send('Not a file');
    }
    
    // Set appropriate headers for ICS file
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Send the file
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Error sending file');
      }
    });
  });
});

const main = async (): Promise<void> => {
  try {
    await connectToMongo();
    app.listen(app.get('port'), () => console.log(`Selfie listening on port ${app.get('port')}`));
  } catch (err) {
    console.error(err);
  }
};

main();
export { app };