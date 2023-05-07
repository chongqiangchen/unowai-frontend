
export type THistory = {
    id: string;
    messages: TMessage[];
    roleId: string;
    createTime: number;
    updateTime: number;
}

export type TMessage = {
    id: string;
    text: string;
    sender: 'gpt' | 'me';
    status: 'error' | 'success' | 'loading';
    createTime: number;
    updateTime: number;
}

export type TRole = {
    id: string;
    name: string;
    prompts: string[];
    color?: string;
    createTime: number;
    updateTime: number;
}

export type THistoryMap = {
    [roleId: string]: THistory[];
}