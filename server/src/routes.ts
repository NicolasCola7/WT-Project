import { Router, Application } from 'express';
import UserController from './controllers/user.controller';
import ActivityController from './controllers/activity.controller';
import CalendarEventController from './controllers/event.controller';


const setRoutes = (app: Application): void => {
  const router = Router();

  //INIZIALIZZAZIONE CONTROLLERS
  const userController = new UserController();
  const eventController = new CalendarEventController();
  const activityController = new ActivityController();
  

  //DEFINIZIONE ROUTES PER OGNI CONTROLLER
  // Users
  router.route('/login').post(userController.login);
  router.route('/user').post(userController.insert);
  router.route('/user/:id').get(userController.get);

  //Events
  router.route('/event').post(eventController.insert);
  router.route('/event/:id').get(eventController.get);
  router.route('/event/:id').delete(eventController.delete);

  //Activities
  router.route('/activity').post(activityController.insert);
  router.route('/activity/:id').get(activityController.get);
  router.route('/activity/:id').delete(activityController.delete);


  // AApplica a tutte le routes il prefisso /api
  app.use('/api', router);

};

export default setRoutes;