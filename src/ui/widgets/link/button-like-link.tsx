'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FunctionComponent } from 'react'

interface ButtonLikeLinkProps {
  href: string
  text: string
  icon?: string
}

const ButtonLikeLink: FunctionComponent<ButtonLikeLinkProps> = ({ href, text, icon }) => (
  <Link href={href} className="h-8 px-4 border border-gray-700 rounded-sm ml-auto flex items-center text-xs">
    {icon && <Image src={icon} alt={text} width={16} height={16} className="mr-2" />}
    {text}
  </Link>
)

export default ButtonLikeLink
