import Image from 'next/image'

const DocLinkTag = ({index, onClick}: {index: number; onClick: () => void}) => {

    return (
        <div className="text-[14px] bg-[#37B75B] rounded px-2 py-1 inline-flex items-center mr-2" onClick={onClick}>
            <Image
                className="w-[16px] h-[16px] mr-[2px] text-white"
                src="/svgs/lamp.svg"
                alt="lamp"
                width={12}
                height={12}
            />
            <span className="text-white">引用{index + 1}</span>
        </div>
    )
}

export default DocLinkTag;