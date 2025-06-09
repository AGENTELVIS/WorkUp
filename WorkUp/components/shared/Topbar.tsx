import { SignedIn, UserButton } from '@clerk/nextjs'
import React from 'react'
import { ModeToggle } from '../../app/page'

const Topbar = () => {
  return (
    <section className='flex-row sticky top-0'>
      <div className='flex py-3 px-4'>
        <div className='flex '><ModeToggle /></div>
        <div className='flex'>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </section>
  )
}

export default Topbar