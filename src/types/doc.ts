import { UploadFile } from "antd";

export type TDoc = {
    id: string;
    file: UploadFile;
    url: string;
}

export type TReferChunk = {
    id: number;
    score: number;
    content: string;
    pageNum: number;
}

export type TRefer = {
    documentId: number;
    title?: string;
    origin?: string;
    score?: string;
    chunks: TReferChunk[];
}

export type THistoryDocGroup = {
    id: string;
    docIds: string[];
}

export type TMessage = {
    id: string;
    text: string;
    refers: TRefer[];
    sender: 'gpt' | 'me';
    status: 'error' | 'success' | 'loading';
    createTime: number;
    updateTime: number;
}

export type THistoryChat = {
    id: string;
    messages: TMessage[];
    createTime: number;
    updateTime: number;
}
