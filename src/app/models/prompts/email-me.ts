import {Prompt} from './prompt';
export interface EmailMePrompt extends Prompt {
    email: string;
    accountId: number;
    listId: string;
}