import { Router, Application } from 'express';


const setRoutes = (app: Application): void => {
  const router = Router();

  //INIZIALIZZAZIONE CONTROLLERS

  //esempio: const userController = new UserController();

  //DEFINIZIONE ROUTES PER OGNI CONTROLLER
  
  // esempio:
  // Users
  //router.route('/login').post(userController.login);
  //router.route('/users').get(userController.getAll);
  
  // AApplica a tutte le routes il prefisso /api
  app.use('/api', router);

};

export default setRoutes;