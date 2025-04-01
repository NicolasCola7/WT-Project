import 'dotenv/config';
import express from 'express';
import { join as pathJoin } from 'path';

import { connectToMongo } from './mongo';
import setRoutes from './routes';

const app = express();
const cors = require('cors');

app.set('port', (process.env.PORT || 3000));
app.use(cors());
app.use('/', express.static(pathJoin(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
setRoutes(app);

const main = async (): Promise<void> => {
  try {
    await connectToMongo();
    app.get('/', (req, res) => {
      res.sendFile(pathJoin(__dirname, '../public/index.html'));
    });
    console.log(__dirname);
    app.listen(app.get('port'), () => console.log(`Selfie listening on port ${app.get('port')}`));
  } catch (err) {
    console.error(err);
  }
};

main();
export { app };