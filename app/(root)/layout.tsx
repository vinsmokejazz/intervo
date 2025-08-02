import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode } from 'react'

const Rootlayout = ({children}:{children:ReactNode}) => {
  return (
    <div className=''>
      <nav>
        <Link href='/' className="flex items-center gap-1">
        <Image src="/logo.svg" alt="Logo" width={38} height={32} />
        <p className=' text-2xl font-bold  text-blue-400'> Intervo</p>
        </Link>
      </nav>
      {children}
    </div>
  )
}

export default Rootlayout
