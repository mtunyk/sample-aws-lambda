import * as React from 'react'
import AnimatedLayout from '@/components/layouts/AnimatedLayout'

import { Inter } from 'next/font/google'
import './globals.scss'

import type { Metadata } from 'next'

const font = Inter({
  subsets: ['latin']
  //weight: ['400', '500', '700'],
  //display: 'swap',
})

export const metadata: Metadata = {
  title: 'sampletld',
  description: 'Admin dashboard for sampletld',
}

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout(props: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" className="antialiased" /*suppressHydrationWarning*/>
      <body className={`${font.className} flex min-h-screen w-full flex-col border border-dashed border-1 border-red-500`}>
        {props.children}
      </body>
    </html>
  )
}
