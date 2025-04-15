import { model, Schema, Types } from "mongoose";

interface MessageI {
    role: 'assistant' | 'system' | 'user';
    content: string
}

interface ChatI {
    title: string;
    messages: MessageI[];
    creatorId: Types.ObjectId
}

const chatSchema = new Schema<ChatI>({
    title: { type: String, required: true, trim: true },
    messages: [{
        role: { 
            type: String, 
            enum: ['assistant', 'system', 'user'],
            required: true 
        },
        content: { type: String, required: true }
    }],
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Chat = model<ChatI>('Chat', chatSchema);

export default Chat;
export type { MessageI }
export type { ChatI };
