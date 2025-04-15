export interface Message {
    role: 'assistant' | 'system' | 'user';
    content: string;
    generating?: boolean;
}