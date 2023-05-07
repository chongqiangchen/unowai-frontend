import request from "@/api/index";

export const uploadDoc = (formData: FormData, config: any) => {
    return request("knowledge/documents/files", {
        method: "POST",
        data: formData,
        ...config
    })
}
