import 'dotenv/config';
import express from 'express';
import { join as pathJoin } from 'path';

import { connectToMongo } from './mongo';
import setRoutes from './routes';

const app = express();

app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(pathJoin(__dirname, '../../client/public')));
app.use(express.json());
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