import { message, Popconfirm, Upload, UploadFile, UploadProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";
import { uploadDoc } from "@/api/doc";
import { LoadingOutlined } from "@ant-design/icons";
import useDocStore from "@/store/doc";
import { fileToBase64 } from "@/utils/file";

const { Dragger } = Upload;

interface CustomUploadOptions {
    onSuccess: (data: any) => void;
    onError: (error: Error) => void;
    file: File;
    onProgress: (event: { percent: number }, file: File) => void;
}

type TFileType = "pdf" | "doc" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
export const FileTag = ({ type, size = 'small' }: { type: TFileType; size?: 'large' | 'small' }) => {

    const config = useMemo(() => ({
        pdf: {
            bg: "rgba(255, 120, 117, 15%)",
            color: "#FF7875",
            icon: "/svgs/doc-pdf.svg",
        },
        "application/pdf": {
            bg: "rgba(255, 120, 117, 15%)",
            color: "#FF7875",
            icon: "/svgs/doc-pdf.svg",
        },
        doc: {
            bg: "rgba(24, 144, 255, 20%)",
            color: "#1890FF",
            icon: "/svgs/doc-doc.svg",
        },
        docx: {
            bg: "rgba(24, 144, 255, 20%)",
            color: "#1890FF",
            icon: "/svgs/doc-doc.svg",
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
            bg: "rgba(24, 144, 255, 20%)",
            color: "#1890FF",
            icon: "/svgs/doc-doc.svg",
        },
    }), []);

    const curConfig = config[type] || {};

    const height = size === 'large' ? 60 : 48;
    const width = size === 'large' ? 60 : 48;
    const iconWidth = size === 'large' ? 30 : 22;
    const iconHeight = size === 'large' ? 30 : 22;

    return (
        <div
            className="inline-flex flex-shrink-0 items-center justify-center rounded-lg"
            style={{ background: curConfig.bg, color: curConfig.color, height: height, width: width }}
        >
            <Image src={curConfig.icon} alt={type} width={iconWidth} height={iconHeight} />
        </div>
    )
}

const UploadItem = ({ uploadFile, id, deleteFile }: { uploadFile: UploadFile; id?: string; deleteFile: (file: UploadFile) => void }) => {

    const isLoading = useMemo(() => {
        return uploadFile.status === 'uploading'
    }, [uploadFile]);

    return (
        <>
            <div className="w-full flex justify-between hover:bg-colorborder3 p-2 rounded-lg">
                <div className="flex gap-3">
                    <FileTag type={uploadFile.type as any} />
                    <div className="flex flex-col gap-1">
                        <span className="text-base">{uploadFile.name}</span>
                        <span className="text-gray2 text-sm">文件大小：{uploadFile.size}</span>
                    </div>
                </div>

                <div className="flex items-center">
                    {isLoading && <LoadingOutlined className="text-base" />}
                    {!isLoading && (
                        <>
                            <Popconfirm
                                title="Delete the task"
                                description="Are you sure to delete this task?"
                                onConfirm={() => deleteFile(uploadFile)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </Popconfirm>
                        </>
                    )}
                </div>
            </div>
            <div className="w-full my-4 h-[1px] bg-colorborder1" />
        </>
    )
}

type TProps = {
    mergeFileList?: UploadFile[];
}

const DocUpload = ({ mergeFileList = [] }: TProps) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const addHistoryDoc = useDocStore(state => state.addHistoryDoc);
    const addSelectedDoc = useDocStore(state => state.addSelectedDoc);

    const deleteFile = (file: UploadFile) => {
        const newFileList = fileList.filter((item) => item.uid !== file.uid);
        setFileList(newFileList);
    }

    const handleChange: UploadProps['onChange'] = async (info) => {
        let newFileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        newFileList = newFileList.slice(-2);

        // 2. Read from response and show file link
        newFileList = newFileList.map((file) => {
            if (file.response) {
                // Component will show file.url as link
                return { ...file, url: file.response.url };
            }
            return file;
        });

        setFileList(newFileList);

        if (info.file.status === 'done') {
            const base64Url = await fileToBase64(info.file.originFileObj!);
            const uploadedFile = {
                id: info.file.response.id, // 使用你的返回数据中的 id 字段，根据实际情况进行调整
                file: info.file,
                url: base64Url,
            };

            addSelectedDoc(uploadedFile);
            addHistoryDoc(uploadedFile);
        }
    };

    const uploadProps: UploadProps = {
        name: 'file',
        showUploadList: false,
        multiple: true,
        action: 'https://ai.mmaozi.com/knowledge/documents/files',
        onChange: handleChange,
        beforeUpload: (file) => {
            const allowedExtensions = ['doc', 'docx', 'pdf'];
            const fileExtension = file?.name.split('.').pop()?.toLowerCase();
            const isAllowedExtension = allowedExtensions.includes(fileExtension || '');

            if (!isAllowedExtension) {
                message.error(`${file.name} is not a valid file type. Please upload a .doc, .docx or .pdf file.`);
            }

            return isAllowedExtension;
        },
        customRequest: async (options) => {
            const { onSuccess, onError, filename, file, onProgress } = options;

            try {
                const formData = new FormData();
                formData.append('title', filename || "");
                formData.append('file', file);

                const config = {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (event: ProgressEvent) => onProgress && onProgress(event),
                };

                const response = await uploadDoc(formData, config)
                onSuccess && onSuccess(response.data);
            } catch (error) {
                onError && onError(error as Error);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    useEffect(() => {
        if (mergeFileList && mergeFileList.length) {
            setFileList(old => old.concat(mergeFileList));
        }
    }, [mergeFileList])

    return (
        <div className="mt-[38px]">
            <div className="w-full flex flex-col px-5">
                {fileList && fileList.map((file, index) => (
                    <UploadItem key={index + "_ufile"} uploadFile={file} deleteFile={deleteFile} />
                ))}
            </div>
            <Dragger {...uploadProps} fileList={fileList}>
                <div className="flex items-center justify-center" style={{ height: fileList.length === 0 ? 213 : 50 }}>
                    <Image src="/svgs/file.svg" alt="File Upload" width={32} height={32} />
                    <span className="ml-3 text-base">点击上传 或 拖拽文件</span>
                </div>
            </Dragger>
        </div>
    )
}

export default DocUpload;
