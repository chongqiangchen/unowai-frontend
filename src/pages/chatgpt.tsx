import useChatStore from "@/store/chat";
import ChatRoom from "@/ui/components/pages/chat/chat-room";
import SlideOver from "@/ui/widgets/slide-over";
import { useBoolean } from "ahooks";
import { Button } from "antd";


const ChatGPT = () => {
    const [roleSettingVisible, roleSettingAction] = useBoolean(false);
    const [historyVisible, historyAction] = useBoolean(false);

    const [addRole, removeRoles, changeRole, currentRoleId, roles] = useChatStore(
        (state) => [state.addRole, state.removeRole, state.changeRole, state.currentRoleId, state.roles],
    );

    console.log(roles);
    console.log(currentRoleId);
    
    return (
        <div className="h-full">
            <ChatRoom
                onOpenHistory={historyAction.setTrue}
                onOpenSetting={roleSettingAction.setTrue}
            />
            <SlideOver
                title='角色选择/配置'
                open={roleSettingVisible}
                onClose={() => roleSettingAction.setFalse()}
            >
                <Button onClick={() => {
                    addRole("测试角色", []);
                }}>测试</Button>
                <Button onClick={() => {
                    removeRoles("98492113-9c26-4fe3-9186-d167581091a6");
                }}>删除</Button>
                <Button
                    onClick={() => {
                        changeRole("58d63ba7-baf3-466a-92cd-22577a24dfbc");
                    }}
                >改变</Button>
                <pre>
                    {JSON.stringify(roles, null, 4)}
                </pre>
                <pre>CurrentID: {currentRoleId}</pre>
            </SlideOver>
            <SlideOver
                title='历史记录'
                open={historyVisible}
                onClose={() => historyAction.setFalse()}
            >Test</SlideOver>
        </div>
    )
}

export default ChatGPT;
