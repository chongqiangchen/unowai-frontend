import { useRouter } from "next/router";
import ChatRoomHeader from "@/ui/components/pages/doc/chat-room/header";
import ChatContent from "@/ui/components/pages/doc/chat-room/content";
import ChatInput from "@/ui/components/pages/doc/chat-room/input";
import useRequestStream from "@/hooks/useRequestStream";
import useDocStore from "@/store/doc";
import { useEffect, useState } from "react";
import { MessageDocFactory } from "@/utils/message-doc-factory";
import { TMessage } from "@/types/doc";
import { useBoolean } from "ahooks";
import PDFViewer from "@/ui/widgets/pdf";


const ChatRoom = () => {
    const router = useRouter()
    const chatroom = (router.query.chatroom as string[]) || []
    const groupId = chatroom[1];
    const sessionId = chatroom[2];

    const updateHistoryChat = useDocStore(state => state.updateHistoryChat);
    const updateHistoryChatRefersByChatId = useDocStore(state => state.updateHistoryChatRefersByChatId);
    const [curMessageObj, setCurMessageObj] = useState<TMessage | undefined>();
    const { sendRequest, message, data, fetching, linkLoading, success } = useRequestStream<any>();


    const send = (message: string) => {
        if (fetching || linkLoading) {
            return;
        }

        setCurMessageObj(MessageDocFactory.create('', "gpt"));
        const messageObj = MessageDocFactory.create(message, "me");
        updateHistoryChat(groupId, sessionId, messageObj);
        sendRequest("POST", "https://ai.mmaozi.com/knowledge/knowledge/query", {
            documentGroupId: groupId,
            query: message,
            stream: true,
            sessionId,
        });

    }

    useEffect(() => {
        if (message && message !== '') {
            if (curMessageObj) {
                const factory = new MessageDocFactory(curMessageObj);
                factory.updateText(message);
                updateHistoryChat(groupId, sessionId, factory.export());
            }
        }
    }, [curMessageObj, groupId, message, sessionId, updateHistoryChat])

    useEffect(() => {
        if (success && curMessageObj) {
            const lastResponse = data[data.length - 1];
            updateHistoryChatRefersByChatId(groupId, sessionId, curMessageObj.id, lastResponse.refers);
            setCurMessageObj(undefined)
        }
    }, [success, curMessageObj, groupId, sessionId])

    return (
        <div className="h-full flex flex-col">
            <ChatRoomHeader />
            <ChatContent groupId={groupId} roomId={sessionId} />
            <ChatInput onSubmit={send} />
        </div>
    )
}

export default ChatRoom;
