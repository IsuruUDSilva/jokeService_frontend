"use client"
import AdminView from '@/components/features/AdminView'
import Image from 'next/image'
import React from 'react'

export default function page() {
  return (
    <div className='w-full h-full'   style={{ backgroundImage: 'url(/minion2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' , backgroundRepeat: 'no-repeat'}} >
       <AdminView/>
    </div>
   
  )
}
