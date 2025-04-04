import { Router, Application } from 'express';
import UserController from './controllers/user.controller';


const setRoutes = (app: Application): void => {
  const router = Router();

  //INIZIALIZZAZIONE CONTROLLERS
  const userController = new UserController();

  //DEFINIZIONE ROUTES PER OGNI CONTROLLER
  // Users
  router.route('/login').post(userController.login);
  router.route('/user').post(userController.insert);
  router.route('/user/:id').get(userController.get);

  // AApplica a tutte le routes il prefisso /api
  app.use('/api', router);

};

export default setRoutes;