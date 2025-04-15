export interface Note {
    id: string;
    title: string;
    content: string;
    categories: string[];
    createdAt: Date;
    updatedAt: Date;
}