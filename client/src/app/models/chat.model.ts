import { Message  }from "./message.model";

export default class Chat {
    _id?: string;
    title?: string;
    messages?: Message[];
    creatorId?: string
    editing?: boolean;
    editTitle?: string;
}