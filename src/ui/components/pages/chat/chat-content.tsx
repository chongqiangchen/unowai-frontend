import useAutoScroll from "@/hooks/useAutoScroll";
import useChatStore from "@/store/chat";
import Placeholder from "@/ui/widgets/placeholder";
import classNames from "classnames";
import { useState } from "react";
import createSelectors from "@/store/createSelectors";

type TChatBlockProps = {
    position?: 'left' | 'right';
    children: React.ReactNode;
}

const ChatBlock = ({ children, position = 'left' }: TChatBlockProps) => {
    return (
        <div className={classNames("flex", { "justify-end": position === 'right' })}>
            <div className={classNames("shadow text-sm/6 w-max max-w-full min-w-[50%] mt-8 rounded p-4 whitespace-pre-wrap", { "bg-[#eee]/60": position === 'left' })}>
                {children}
            </div>
        </div>
    )
}


const ChatContent = () => {
    const chatStore = createSelectors(useChatStore);

    const [content, setContent] = useState<string[]>([]);

    const { containerRef, handleScroll } = useAutoScroll(content);


    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            style={{ scrollBehavior: "smooth" }}
            className="flex-auto overflow-auto"
        >
            <ChatBlock>
                {content.join("\n")}
            </ChatBlock>
            <Placeholder height={20} />
        </div>
    )
}

export default ChatContent;