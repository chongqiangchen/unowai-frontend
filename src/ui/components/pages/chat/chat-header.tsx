import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

export type TChatRoomHeaderProps = {
    onOpenSetting: () => void;
    onOpenHistory: () => void;
}

const ChatRoomHeader = (props: TChatRoomHeaderProps) => {
    const {
        onOpenHistory,
        onOpenSetting
    } = props;

    return (
        <div className="w-full flex-shrink-0 border-b border-solid border-[#000]/10 h-14 text-md text-black flex justify-between items-center">
            <span>ChatGPT - 聊天</span>
            <AdjustmentsHorizontalIcon className="w-5 h-5" onClick={() => onOpenSetting && onOpenSetting()} />
        </div>
    )
}

export default ChatRoomHeader;