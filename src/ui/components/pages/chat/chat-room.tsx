import { useMemo, useState } from "react";
import ChatRoomHeader, { TChatRoomHeaderProps } from "./chat-header";
import ChatInput from "./chat-input";
import Placeholder from "@/ui/widgets/placeholder";
import ChatContent from "./chat-content";


type TChatRoomProps = TChatRoomHeaderProps & {

}

const ChatRoom = (props: TChatRoomProps) => {
    const { onOpenSetting, onOpenHistory } = props;

    const headerState = useMemo(() => ({
        onOpenSetting,
        onOpenHistory
    }), [onOpenSetting, onOpenHistory]);

    return (
        <div className="h-full border border-solid border-[#000]/10 rounded-lg px-3 flex flex-col relative">
            <ChatRoomHeader {...headerState} />

            <ChatContent />

            <Placeholder height={130} />
            <ChatInput />
        </div>
    )
}

export default ChatRoom;