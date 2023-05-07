import { TMessage } from "@/types/chat";
import {v4 as uuidv4} from "uuid";

export class MessageFactory {
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
