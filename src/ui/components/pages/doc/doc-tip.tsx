type TProps = {
    title: string;
    description: string;
}

const DocTip = ({title, description}: TProps) => {
    return (
        <div className="w-full shadow rounded-md flex flex-col p-6 mb-4 bg-box-1">
            <div className="text-base mb-2">{title}</div>
            <div className="text-sm text-[#6c727c]">{description}</div>
        </div>
    )
}

export default DocTip;
