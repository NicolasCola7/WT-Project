import CalendarEvent, { CalendarEventI } from "../models/event.model";
import BaseController from "./base.controller";

export default class CalendarEventController extends BaseController<CalendarEventI> {
    model = CalendarEvent;
}