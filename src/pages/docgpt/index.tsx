import DocTip from "@/ui/components/pages/doc/doc-tip";
import DocUpload from "@/ui/components/pages/doc/doc-upload";
import useDocStore from "@/store/doc";
import { Button, UploadFile } from "antd";
import { createDocGroup as createDocGroupApi } from "@/api/doc-group";
import useRequestStream from "@/hooks/useRequestStream";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const DocGPT = () => {
    const selectedDocs = useDocStore(state => state.selectedDocs);
    const clearSelectedDoc = useDocStore(state => state.clearSelectedDoc);
    const saveDocGroup = useDocStore(state => state.addHistoryDocGroup);
    const { sendRequest } = useRequestStream();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const createDocGroup = async () => {
        const docIds = selectedDocs.map(doc => doc.id);
        // create random title
        const title = `无名_${Math.random().toString(36)}`;

        const res = await createDocGroupApi(docIds, title);
        const id = res.data.id;
        saveDocGroup(id, docIds);

        return res.data.id;
    }

    const createRoom = async (groupId: string) => {
        const res = sendRequest("POST", "https://ai.mmaozi.com/knowledge/knowledge/query", {
            documentGroupId: groupId,
            query: "hi",
            stream: false,
        });
        const info: any = await res.wait();
        return info[0].sessionId;
    }

    const startChat = async () => {
        setLoading(true);
        try {
            const groupId = await createDocGroup();
            const sessionId = await createRoom(groupId);
            router.push(`/docgpt/chat/${groupId}/${sessionId}`);
        } catch (e) { }
        setLoading(false);
    }

    useEffect(() => {
        clearSelectedDoc();
    }, [])

    return (
        <div className="h-full w-full m-auto">
            <h2 className="text-2xl bold text-black mb-7 text-center md:text-left">DocGPT 工具</h2>
            <DocTip
                title="它能做什么"
                description="选择要处理的多个文档内容，导入后DocGPT将会根据在文档范围内搜寻符合要求的内容给予回复，你也可以看到回复的信息摘取自哪个内容块。"
            />
            <div className="w-full">
                <DocUpload />
                <div className="flex justify-center">
                    <Button
                        type="primary"
                        className="mt-4"
                        onClick={startChat}
                        loading={loading}
                        disabled={selectedDocs.length <= 0}
                    >进入聊天</Button>
                </div>
                {/* <DocHistory onSelected={selectHistoryDoc} /> */}
            </div>
        </div>
    )
}

export default DocGPT;
