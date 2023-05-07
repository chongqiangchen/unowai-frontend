import Link from 'next/link'
import { useRouter } from 'next/router';
import { FunctionComponent, ReactNode } from 'react'

const SubMenu: FunctionComponent<{ children: ReactNode; text: string }> = ({ children, text }) => (
  <div className="flex flex-col mr-36">
    <h1 className="text-xl">{text}</h1>
    {children}
  </div>
)

const MenuItem: FunctionComponent<{ children: ReactNode }> = ({ children }) => <div className="text-sm text-gray-600 font-normal mt-6">{children}</div>

const SiteFooter: FunctionComponent = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const isHome = currentPath === '/';

  return isHome ? <div className="px-32 flex flex-col h-10" /> : <div />
}

export default SiteFooter
