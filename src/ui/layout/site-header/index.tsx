import Link from 'next/link'
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react'

const SiteHeader: FunctionComponent = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const isHome = currentPath === '/';

  return (
    <>
      <div
        className="h-12 bg-white flex flex-row px-6 items-center fixed top-0 left-0 right-0 border-b border-solid border-colorborder1"
      >
        <Link href="/">
          <span className="text-xl font-semibold">UnowAI</span>
        </Link>
        <div></div>
      </div>
      <div className="flex-shrink-0 h-12 w-full" />
    </>
  )
}

export default SiteHeader
