import { Navbar } from '@/components/Navbar'
import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

const layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      <div className='flex h-screen items-center justify-center  '>
        {children}
      </div>
    </>
  )
}

export default layout
