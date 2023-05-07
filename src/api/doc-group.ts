import request from "@/api/index";

export const createDocGroup = (documentIds: string[], title: string) => {
    return request.post("knowledge/document-groups", {
        documentIds,
        title
    })
}
