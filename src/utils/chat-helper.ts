import { THistory, TMessage, TRole } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

export class HistoryHelper {
    id: string;
    messages: TMessage[];
    roleId: string;
    createTime: number;
    updateTime: number;

    constructor(history: THistory) {
        this.id = history.id;
        this.messages = history.messages;
        this.roleId = history.roleId;
        this.createTime = history.createTime;
        this.updateTime = history.updateTime;
    }

    addMessage(message: TMessage) {
        this.messages.push(message);
        this.updateTime = Date.now();
    }

    removeMessage(messageId: string) {
        this.messages = this.messages.filter(message => message.id !== messageId);
        this.updateTime = Date.now();
    }

    updateMessage(messageId: string, text: string) {
        const index = this.messages.findIndex(message => message.id === messageId);
        const message = this.messages[index];

        if (message) {
            const messageHelper = new MessageHelper(message);
            messageHelper.updateText(text);
            this.updateTime = Date.now();
            this.messages[index] = messageHelper.export();

            return messageHelper.export();
        }
    }

    export(): THistory {
        return {
            id: this.id,
            messages: this.messages,
            roleId: this.roleId,
            createTime: this.createTime,
            updateTime: this.updateTime,
        };
    }

    static create(roleId: string): THistory {
        return {
            id: uuidv4(),
            messages: [],
            roleId,
            createTime: Date.now(),
            updateTime: Date.now(),
        }
    }
}

export class MessageHelper {
    id: string;
    text: string;
    sender: 'gpt' | 'me';
    status: 'error' | 'success' | 'loading';
    createTime: number;
    updateTime: number;

    constructor(message: TMessage) {
        this.id = message.id;
        this.text = message.text;
        this.sender = message.sender;
        this.status = message.status;
        this.createTime = message.createTime;
        this.updateTime = message.updateTime;
    }

    updateStatus(status: 'error' | 'success' | 'loading') {
        this.status = status;
        this.updateTime = Date.now();
    }

    updateText(text: string) {
        this.text = text;
        this.updateTime = Date.now();
    }

    export(): TMessage {
        return {
            id: this.id,
            text: this.text,
            sender: this.sender,
            status: this.status,
            createTime: this.createTime,
            updateTime: this.updateTime
        };
    }

    static create(text: string, sender: 'gpt' | 'me'): TMessage {
        return {
            id: uuidv4(),
            text,
            sender,
            status: 'success',
            createTime: Date.now(),
            updateTime: Date.now(),
        };
    }
}

export class RoleHelper {
    id: string;
    name: string;
    prompts: string[];
    color?: string;
    createTime: number;
    updateTime: number;

    constructor(role: TRole) {
        this.id = role.id;
        this.name = role.name;
        this.prompts = role.prompts;
        this.color = role.color;
        this.createTime = role.createTime;
        this.updateTime = role.updateTime;
    }

    updatePrompt(prompts: string[]) {
        this.prompts = prompts;
        this.updateTime = Date.now();
    }

    updateColor(color: string) {
        this.color = color;
        this.updateTime = Date.now();
    }

    updateName(name: string) {
        this.name = name;
        this.updateTime = Date.now();
    }

    export(): TRole {
        return {
            id: this.id,
            name: this.name,
            prompts: this.prompts,
            color: this.color,
            createTime: this.createTime,
            updateTime: this.updateTime
        };
    }

    static create(name: string, prompts: string[], color?: string): TRole {
        return {
            id: uuidv4(),
            name,
            prompts,
            color,
            createTime: Date.now(),
            updateTime: Date.now(),
        };
    }
}