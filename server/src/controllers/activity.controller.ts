import Activity, { ActivityI } from "../models/activity.model";
import BaseController from "./base.controller";

export default class ActivityController extends BaseController<ActivityI> {
    model = Activity;
}