export interface Message {
    _id?: string;
    role: 'assistant' | 'system' | 'user';
    content: string;
    generating?: boolean;
}