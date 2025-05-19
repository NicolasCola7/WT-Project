import { model, Schema, Types } from "mongoose";

export const categories = ['Lavoro', 'Attività', 'Studio', 'Idee', 'Personale', 'Lettura', 'Creatività'];

interface NoteI {
    title: string;
    content: string;
    category: 'Lavoro' | 'Attività' | 'Studio' | 'Idee' | 'Personale' | 'Lettura' | 'Creatività';
    createdAt: Date;
    updatedAt?: Date;
    creatorId: Types.ObjectId;
};

const noteSchema = new Schema<NoteI>({
    title: {type: String, trim: true, unique: false, required: true},
    content: {type: String, trim: true, unique: false, required: true},
    category: {type: String, required: true, enum: categories},
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: false },
    creatorId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
});

const Note = model<NoteI>('Note', noteSchema);

export default Note;
export type { NoteI };