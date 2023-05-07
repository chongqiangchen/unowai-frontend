import { TDoc, THistoryChat, THistoryDocGroup, TMessage, TRefer } from '@/types/doc';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type TDocState = {
    selectedDocs: TDoc[];
    historyDocGroups: THistoryDocGroup[];
    historyDocs: TDoc[];
    historyChatWithDocGroupId: {
        [groupId: string]: {
            [chatRoomId: string]: THistoryChat;
        }
    };
}

type TDocAction = {
    addSelectedDoc: (doc: TDoc) => void;
    removeSelectedDoc: (docId: string) => void;
    clearSelectedDoc: () => void;
    addHistoryDocGroup: (groupId: string, docIds: string[]) => void;
    removeHistoryDocGroup: (groupId: string) => void;
    addHistoryDoc: (doc: TDoc) => void;
    removeHistoryDoc: (docId: string) => void;
    updateHistoryChat: (groupId: string, chatRoomId: string, message: TMessage) => void;
    updateHistoryChatRefersByChatId: (groupId: string, chatRoomId: string, chatId: string, refers: TRefer[]) => void;
    removeHistoryChat: (groupId: string, chatRoomId: string) => void;
    getCurrentChat: (groupId: string, chatRoomId: string) => THistoryChat;
}

const useDocStore = create(
    persist(
        immer<TDocState & TDocAction>(
            (set, get) => ({
                selectedDocs: [],
                historyDocGroups: [],
                historyDocs: [],
                historyChatWithDocGroupId: {},
                curChats: [],
                curChatId: '',
                addSelectedDoc: (doc) => set((state) => {
                    console.log(doc);
                    state.selectedDocs.push(doc);
                }),
                removeSelectedDoc: (docId) => set((state) => {
                    state.selectedDocs = state.selectedDocs.filter(doc => doc.id !== docId);
                }),
                clearSelectedDoc: () => set((state) => {
                    state.selectedDocs = [];
                }),
                addHistoryDocGroup: (groupId: string, docIds: string[]) => set((state) => {
                    state.historyDocGroups.push({
                        id: groupId,
                        docIds,
                    });
                }),
                removeHistoryDocGroup: (groupId) => set((state) => {
                    state.historyDocGroups = state.historyDocGroups.filter(group => group.id !== groupId);
                }),
                addHistoryDoc: (doc) => set((state) => {
                    state.historyDocs.push(doc);
                }),
                removeHistoryDoc: (docId) => set((state) => {
                    state.historyDocs = state.historyDocs.filter(doc => doc.id !== docId);
                }),
                updateHistoryChat: (groupId, chatRoomId, message) => set((state) => {
                    if (!state.historyChatWithDocGroupId[groupId]) {
                        state.historyChatWithDocGroupId[groupId] = {};
                    }

                    if (!state.historyChatWithDocGroupId[groupId][chatRoomId]) {
                        state.historyChatWithDocGroupId[groupId][chatRoomId] = {
                            id: chatRoomId,
                            messages: [],
                            createTime: Date.now(),
                            updateTime: Date.now(),
                        };
                    }

                    const chatRoom: THistoryChat = state.historyChatWithDocGroupId[groupId][chatRoomId];
                    const index = chatRoom.messages.findIndex(chat => chat.id === message.id);

                    if (index > -1) {
                        chatRoom.messages[index] = message;
                    } else {
                        chatRoom.messages.push(message);
                    }
                }),
                updateHistoryChatRefersByChatId: (groupId, chatRoomId, chatId, refers) => set((state) => {
                    if (!state.historyChatWithDocGroupId[groupId]) {
                        state.historyChatWithDocGroupId[groupId] = {};
                    }

                    if (!state.historyChatWithDocGroupId[groupId][chatRoomId]) {
                        state.historyChatWithDocGroupId[groupId][chatRoomId] = {
                            id: chatRoomId,
                            messages: [],
                            createTime: Date.now(),
                            updateTime: Date.now(),
                        };
                    }

                    const chatRoom: THistoryChat = state.historyChatWithDocGroupId[groupId][chatRoomId];
                    const index = chatRoom.messages.findIndex(chat => chat.id === chatId);

                    if (index > -1) {
                        chatRoom.messages[index].refers = refers;
                    }
                }),
                removeHistoryChat: (groupId, chatRoomId) => set((state) => {
                    if (!state.historyChatWithDocGroupId[groupId]) {
                        state.historyChatWithDocGroupId[groupId] = {};
                    }

                    if (!state.historyChatWithDocGroupId[groupId][chatRoomId]) {
                        state.historyChatWithDocGroupId[groupId][chatRoomId] = {
                            id: chatRoomId,
                            messages: [],
                            createTime: Date.now(),
                            updateTime: Date.now(),
                        };
                    }

                    state.historyChatWithDocGroupId[groupId][chatRoomId] = {
                        id: chatRoomId,
                        messages: [],
                        createTime: Date.now(),
                        updateTime: Date.now(),
                    };
                }),
                getCurrentChat: (groupId, chatRoomId) => {
                    const state = get();
                    if (!groupId || !chatRoomId) {
                        return {
                            id: '',
                            messages: [],
                            createTime: Date.now(),
                            updateTime: Date.now(),
                        };
                    }

                    if (!state.historyChatWithDocGroupId[groupId]) {
                        state.historyChatWithDocGroupId = {[groupId]: {}};
                    }

                    if (!state.historyChatWithDocGroupId[groupId][chatRoomId]) {
                        state.historyChatWithDocGroupId[groupId][chatRoomId] = {
                            id: chatRoomId,
                            messages: [],
                            createTime: Date.now(),
                            updateTime: Date.now(),
                        };
                    }

                    return state.historyChatWithDocGroupId[groupId][chatRoomId];
                }
            }),
        ),
        {
            name: 'doc-gpt-store',
            getStorage: () => ({
                setItem: (...args) => window.localStorage.setItem(...args),
                removeItem: (...args) => window.localStorage.removeItem(...args),
                getItem: async (...args) =>
                    new Promise((resolve) => {
                        if (typeof window === "undefined") {
                            resolve(null);
                        } else {
                            setTimeout(() => {
                                resolve(window.localStorage.getItem(...args));
                            }, 400);
                        }
                    }),
            }),
        }
    )
)
export default useDocStore;
