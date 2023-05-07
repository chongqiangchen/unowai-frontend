'use client'

import classNames from 'classnames'
import Image from 'next/image'
import { FunctionComponent } from 'react'

interface TextInputProps {
  placeholder?: string
  icon?: string
}

const TextInput: FunctionComponent<TextInputProps> = ({ placeholder, icon }) => {
  return (
    <div className="mt-12 relative">
      <input
        type="text"
        placeholder={placeholder}
        className={classNames([
          'w-80 h-10 border border-gray-400 rounded-sm',
          {
            'indent-8 ': icon,
            'indent-4 ': !icon,
          },
        ])}
      />
      {icon && <Image src={icon} alt="" width={16} height={16} className="absolute top-1/2 -mt-2 ml-2" />}
    </div>
  )
}

export default TextInput
