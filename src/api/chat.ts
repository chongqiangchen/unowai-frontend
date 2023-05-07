import request from "@/api/index";


const createChatRoom = () => {
    return request.post("chat/", {})
}
