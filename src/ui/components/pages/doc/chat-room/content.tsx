import { useEffect, useMemo, useRef, useState } from "react";
import useAutoScroll from "@/hooks/useAutoScroll";
import Placeholder from "@/ui/widgets/placeholder";
import useDocStore from "@/store/doc";
import { TMessage, TReferChunk } from "@/types/doc";
import DocLinkTag from "@/ui/widgets/doc-link-tag";
import Copy from "@/ui/widgets/copy";
import { useBoolean } from "ahooks";
import PDFViewer from "@/ui/widgets/pdf";
import { base64ToFile } from "@/utils/file";

type TProps = {
    text: string;
}

const ChatBlockWithUser = ({ text }: TProps) => {
    return (
        <div className="flex justify-end">
            <div
                className="border border-solid border-[#DCDADA] rounded-lg bg-white text-base/6 w-max max-w-full mt-8 px-4 py-3 whitespace-pre-wrap">
                {text}
            </div>
        </div>
    )
}

type TSystemChatProps = {
    message: TMessage;
    onClickLink: (chunk: TReferChunk) => void;
}

const ChatBlockWithSystem = ({ message, onClickLink }: TSystemChatProps) => {
    const [bestRefer, bestThreeChunks] = useMemo(() => {
        const refers = message.refers;
        console.log(refers);

        if (!refers || refers.length === 0) {
            return [];
        }

        const bestRefer = refers[0];
        const threeChunks = bestRefer.chunks.slice(0, 3);
        return [bestRefer, threeChunks];
    }, [message.refers]);

    return (
        <div className="flex flex-col">
            <div
                className="relative border border-solid border-[#DCDADA] rounded-lg text-base/6 w-max max-w-full mt-8 px-4 py-4 whitespace-pre-wrap bg-[#F8F9FA]">
                <div className="absolute bottom-2 right-2">
                    <Copy text={message.text} />
                </div>
                {message.text}
            </div>
            <div className="mt-2">
                {bestThreeChunks && bestThreeChunks.map((chunk: any, index: number) => (
                    <DocLinkTag
                        key={index + "_refer"}
                        index={index}
                        onClick={() => onClickLink(chunk)}
                    />
                ))}
            </div>
        </div>
    )
}

const ChatContent = ({ groupId, roomId }: { groupId: string; roomId: string }) => {
    const getCurrentChat = useDocStore(state => state.getCurrentChat);
    const selectedDocs = useDocStore(state => state.selectedDocs);
    const [content, setContent] = useState<string>('');
    const { containerRef, handleScroll } = useAutoScroll(content);

    const currentChat = getCurrentChat(groupId, roomId);
    const currentDoc = selectedDocs[0];

    const pdfRef = useRef<any>({});
    const [pdfVisible, pdfVisibleAction] = useBoolean(false);

    const handleOpenLinkDoc = (chunk: TReferChunk) => {
        pdfVisibleAction.setTrue();

        setTimeout(() => {
            pdfRef.current.jumpToPage(chunk.pageNum);
            pdfRef.current.addHighlight(chunk.content);
        })
    }

    useEffect(() => {
        const lastMessage = currentChat.messages[currentChat.messages.length - 1];
        setContent(lastMessage?.text);
    }, [currentChat])

    return (
        <>
            <div
                ref={containerRef}
                onScroll={handleScroll}
                style={{ scrollBehavior: "smooth" }}
                className="flex-auto overflow-auto"
            >
                {currentChat.messages.map((message: TMessage, index: number) => {
                    if (message.sender === "gpt") {
                        return <ChatBlockWithSystem
                            message={message}
                            key={index}
                            onClickLink={handleOpenLinkDoc}
                        />
                    } else {
                        return <ChatBlockWithUser text={message.text} key={index} />
                    }
                })}
                <Placeholder height={20} />
            </div>
            {pdfVisible && (
                <PDFViewer
                    ref={pdfRef}
                    pdf={base64ToFile(currentDoc.url, currentDoc.file.fileName!)}
                    onClose={pdfVisibleAction.setFalse}
                />
            )}
        </>
    )
}

export default ChatContent;
