import useDocStore from "@/store/doc";
import { TDoc } from "@/types/doc";
import {FileTag} from "@/ui/components/pages/doc/doc-upload";

type TProps = {
    onSelected: (doc: TDoc) => void;
}

const EmptyHistory = () => {
    return (
        <div
            className="w-full h-[64px] border border-dashed border-colorborder2 bg-gray1 flex items-center justify-center rounded-lg text-gray2">
            暂无数据
        </div>
    )
}

const truncateFilename = (str: string, len = 8): string => {
    const name = str.split(".")[0];
    if (name.length <= len) {
        return name;
    }
    return name.slice(0, len) + "...";
}

const DocHistory = ({onSelected}: TProps) => {
    const docs = useDocStore(state => state.historyDocs);

    return (
        <div className="w-full">
            <h3 className="mt-9 mb-4 text-lg bold">历史文件：</h3>
            {docs && docs.length === 0 ? (
                <EmptyHistory/>
            ) : (
                <div className="flex w-full p-4 overflow-x-auto gap-4 bg-gray1 rounded-lg">
                    {docs.map((doc, index) => (
                        <div 
                            key={index + "_histroyfile"} 
                            className="flex flex-col gap-1 items-center flex-shrink-0"
                            onClick={() => onSelected(doc)}
                        >
                            <FileTag type={doc.file.type as any} size="large"/>
                            <div className="text-sm">{truncateFilename(doc.file.name)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default DocHistory;
