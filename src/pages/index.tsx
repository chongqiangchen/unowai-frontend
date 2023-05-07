import Image from 'next/image'
import Collects from '@/ui/components/pages/home/collects'

// const inter = Inter({ subsets: ['latin'] })

const GPT_COLLECTS = [
  // {
  //   title: "ChatGPT聊天",
  //   description: "常规ChatGPT聊天模式",
  //   link: "/chatgpt"
  // },
  {
    title: "DocGPT",
    description: "专用于文档处理的AI工具",
    link: "/docgpt"
  },
]

export default function Home() {
  return (
    <div className="px-[38px] pt-7 md:px-[138px] md:pt-[68px]">
      <div className="flex items-center gap-3">
        <Image src="/svgs/tool-flag.svg" alt="Tool Flag" className="w-[27px] h-8" width={32} height={32} />
        <h1 className="text-xl font-medium md:text-2xl">工具集</h1>
      </div>
      <div className="text-base/7 mt-4 text-[#6c727c] lg:max-w-[80%] xl:max-w-[60%]">
        这是一个AI工具集软件，其中包含了基于AI技术的ChatGPT聊天工具和文档工具。ChatGPT聊天工具可以轻松帮助您和他人进行各种聊天和沟通，而文档工具则提供了智能的文档处理功能。更新频繁、性能强劲，绝对是值得尝试的软件
      </div>

      {/* <Collects label="最近使用" items={[]} /> */}
      <Collects label="GPT集合" items={GPT_COLLECTS} />
    </div>
  )
}
