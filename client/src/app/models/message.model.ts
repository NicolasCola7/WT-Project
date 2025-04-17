export interface Message {
    id?: string;
    role: 'assistant' | 'system' | 'user';
    content: string;
    generating?: boolean;
}