import Link from "next/link";

type TProps = {
    label: string;
    items: any[];
}

type TCollect = {
    title: string;
    description: string;
    link: string;
}

const Collect = ({ collect }: { collect: TCollect }) => {
    return (
        <Link href={collect.link}>
            <div className="w-full md:w-[340px] h-[120px] shadow rounded-md flex flex-col p-6 mb-4">
                <div className="text-base mb-2">{collect.title}</div>
                <div className="text-sm text-[#6c727c]">{collect.description}</div>
            </div>
        </Link>
    )
}

const EmptyCollect = () => {
    return (
        <div className="w-full md:w-[340px] h-[120px] text-[#6c727c] border border-dashed border-[#000000]/20 rounded-lg flex items-center justify-center">
            Empty
        </div>
    )
}

const Collects = ({ label, items }: TProps) => {

    return (
        <div className="mt-8">
            <div className="text-lg font-medium mb-6">{label}</div>
            <div className="md:flex md:gap-4">
                {items.map(item => (
                    <Collect collect={item} />
                ))}
                {!items.length && <EmptyCollect />}
            </div>
        </div>
    )
}

export default Collects;