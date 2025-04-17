import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { join as pathJoin, resolve } from 'path';
import { connectToMongo } from './mongo';
import setRoutes from './routes';

const envPath = resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const app = express();

app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(pathJoin(__dirname, '../../client/public')));
app.use(express.json());
app.use(express.text());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
setRoutes(app);

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