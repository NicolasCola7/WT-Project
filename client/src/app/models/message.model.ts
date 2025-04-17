export interface Message {
    id?: string;
    role: 'assistant' | 'system' | 'user';
    content: string | Promise<string>;
    generating?: boolean;
}