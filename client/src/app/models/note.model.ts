export default class Note {
    _id?: string;
    title?: string;
    content?: string;
    category?: 'Lavoro' | 'Attività' | 'Studio' | 'Idee' | 'Personale' | 'Lettura' | 'Creatività';
    createdAt?: Date;
    updatedAt?: Date;
    creatorId?: string;
}