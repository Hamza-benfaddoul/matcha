'use client'

import { Button } from '@/components/ui/button'
import { Link } from "react-router-dom";


interface BackButtonProps {
  href: string
  label: string
}


const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button variant='link' size='sm' asChild className='w-full font-normal'>
      <Link to={href}>{label}</Link>
    </Button>
  )
}

export default BackButton
