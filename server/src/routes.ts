import { Router, Application } from 'express';
import UserController from './controllers/user.controller';
import ActivityController from './controllers/activity.controller';
import CalendarEventController from './controllers/event.controller';
import ChatController from './controllers/chat.controller';
import ImportedCalendarController from './controllers/imported-calendar.controller';
import UploadedCalendarController from './controllers/uploaded-calendar.controller';


const setRoutes = (app: Application): void => {
  const router = Router();

  //INIZIALIZZAZIONE CONTROLLERS
  const userController = new UserController();
  const eventController = new CalendarEventController();
  const activityController = new ActivityController();
  const chatController = new ChatController();
  const importedCalendarController = new ImportedCalendarController();
  const uploadedCalendarController = new UploadedCalendarController();

  //DEFINIZIONE ROUTES PER OGNI CONTROLLER
  // Users
  router.route('/login').post(userController.login);
  router.route('/user').post(userController.insert);
  router.route('/user/:id').get(userController.get);

  //Events
  router.route('/event').post(eventController.insert);
  router.route('/event/:id').get(eventController.get);
  router.route('/event/:id').delete(eventController.delete);
  router.route('/events').get(eventController.getMyEvents);
  router.route('/event/:id').put(eventController.update);

  //Activities
  router.route('/activity').post(activityController.insert);
  router.route('/activity/:id').get(activityController.get);
  router.route('/activity/:id').delete(activityController.delete);
  router.route('/activities').get(activityController.getMyActivities);
  router.route('/activity/:id').put(activityController.update);

  //Chat
  router.route('/chats').post(chatController.insert);
  router.route('/chats').get(chatController.getMyChats);
  router.route('/chats/:id').post(chatController.generateResponse);
  router.route('/chats/:id').put(chatController.update);
  router.route('/chats/:id').get(chatController.get);
  router.route('/chats/:id').delete(chatController.delete);

  //Imported Calendar
  router.route('/imported-calendars').post(importedCalendarController.insert);
  router.route('/imported-calendars/:id').get(importedCalendarController.get);
  router.route('/imported-calendars/:id').delete(importedCalendarController.delete);
  router.route('/imported-calendars').get(importedCalendarController.getMyImportedCalendars);

  //Uploaded calendar
  router.route('/uploaded-calendars').post(uploadedCalendarController.insert);
  router.route('/uploaded-calendars/:id').get(uploadedCalendarController.get);
  router.route('/uploaded-calendars/:id').delete(uploadedCalendarController.delete);
  router.route('/uploaded-calendars').get(uploadedCalendarController.getMyUploadedCalendars);
 
  // AApplica a tutte le routes il prefisso /api
  app.use('/api', router);

};

export default setRoutes;