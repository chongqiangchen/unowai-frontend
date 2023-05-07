import { HistoryHelper, MessageHelper, RoleHelper } from '@/utils/chat-helper';
import { StateCreator, StoreApi, create } from 'zustand'
import { NamedSet, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type TChatState = TRoleState & THistoryState;

type TRoleState = {
    roles: TRole[];
    currentRoleId: string;
    addRole: (name: string, prompts: string[], color?: string) => void;
    removeRole: (id: string) => void;
    getCurrentRole: () => RoleHelper | null;
    changeRole: (id: string) => void;
}

type THistoryState = {
    historyMap: THistoryMap;
    getCurrentChat: () => HistoryHelper | null;
    addHistory: (roleId: string) => void;
    removeHistory: (historyId: string) => void;
    addMessage: (historyId: string, text: string, sender: 'gpt' | 'me') => void;
    updateMessage: (historyId: string, messageId: string, text: string) => void;
}

export type StoreSlice<T> = (
    set: (fn: ((state: TChatState) => void) | Partial<TRoleState>) => any,
    get: StoreApi<TChatState>['getState'],
    api: StoreApi<TChatState>
) => T;

const createRoleSlice: StoreSlice<TRoleState> = (set, get) => ({
    roles: [],
    currentRoleId: '',
    
    addRole: (name, prompts, color) => set((state) => {
        const roles = state.roles;
        const role = RoleHelper.create(name, prompts, color);
        roles.push(role);
    }),

    removeRole: (id) => set((state) => {
        state.roles = state.roles.filter(role => role.id !== id);
    }),

    getCurrentRole: () => {
        const roles = get().roles;
        const currentRoleId = get().currentRoleId;
        const role = roles.find(role => role.id === currentRoleId);
        if (!role) {
            return null;
        }
        return new RoleHelper(role);
    },
    changeRole: (id) => set({ currentRoleId: id })
})


const createHistorySlice: StoreSlice<THistoryState> = (set, get) => ({
    historyMap: {},

    getCurrentChat: () => {
        const historyMap = get().historyMap;
        const currentRoleId = get().currentRoleId;
        const histories = historyMap[currentRoleId];
        if (!histories) {
            return null;
        }
        const history = histories[0];
        if (!history) {
            return null;
        }
        return new HistoryHelper(history);
    },

    addHistory: (roleId) => set((state) => {
        const historyMap = state.historyMap;
        const histories = historyMap[roleId] || [];
        const history = HistoryHelper.create(roleId);
        histories.unshift(history);
        historyMap[roleId] = histories;
        return { historyMap };
    }),

    removeHistory: (historyId) => set((state) => {
        const historyMap = state.historyMap;
        for (let roleId in historyMap) {
            const histories = historyMap[roleId];
            const newHistories = histories.filter(history => history.id !== historyId);
            historyMap[roleId] = newHistories;
        }
        return { historyMap };
    }),

    addMessage: (historyId, text, sender) => set((state) => {
        const historyMap = state.historyMap;
        const currentRoleId = state.currentRoleId;
        const histories = historyMap[currentRoleId];
        if (!histories) {
            return {};
        }
        
        const targetHistory = histories.find(history => history.id === historyId);

        if (!targetHistory) {
            return {};
        }

        const message = MessageHelper.create(text, sender);
        targetHistory.messages.push(message);
        return { historyMap };
    }),

    updateMessage: (historyId, messageId, text) => set((state) => {
        const historyMap = state.historyMap;
        const currentRoleId = state.currentRoleId;
        const histories = historyMap[currentRoleId];
        if (!histories) {
            return {};
        }
        
        const targetHistory = histories.find(history => history.id === historyId);

        if (!targetHistory) {
            return {};
        }

        const targetMessage = targetHistory.messages.find(message => message.id === messageId);

        if (!targetMessage) {
            return {};
        }

        targetMessage.text = text;
        return { historyMap };
    })
})


const useChatStore = create(
    persist(
        immer<TChatState>(
            (...a) => ({
                ...createRoleSlice(...a),
                ...createHistorySlice(...a),
            })
        ),
        { name: 'chat-gpt-store' }
    )
)

export default useChatStore;