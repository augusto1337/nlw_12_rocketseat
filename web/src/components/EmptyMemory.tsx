import Link from 'next/link'
import React from 'react'

export default function EmptyMemory() {
  return (
    <div className="flex flex-1 items-center justify-center p-16">
      <p className="w-[360px] text-center leading-relaxed">
        Você ainda não registrou nenhuma lembrança, comece a{' '}
        <Link className="underline hover:text-gray-50" href="/memories/new">
          criar agora!
        </Link>
      </p>
    </div>
  )
}
