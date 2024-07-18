'use client'

import React, { forwardRef, useEffect, useState } from 'react'
import { useSelectedLayoutSegment, useSelectedLayoutSegments } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

import RouterProvider from '@/components/providers/RouterProvider'
import Modal from '@/components/modals/Modal'

import type { ElementRef } from 'react'

const Child = forwardRef<
  ElementRef<typeof motion.div>,
  { children: React.ReactNode }
>((props, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
    >
      <RouterProvider>{props.children}</RouterProvider>
    </motion.div>
  )
})

Child.displayName = 'Child'

export default function AnimatedLayout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const segment = useSelectedLayoutSegment()
  const segments = useSelectedLayoutSegments('modal')
  const [modalShown, setModalShown] = useState(false)

  useEffect(() => {
    const isShown = segments.join('') !== '__DEFAULT__'
    document.body.classList.toggle('overflow-hidden', isShown)
    setModalShown(isShown)
  }, [segments])

  return (
    <>
      <AnimatePresence mode="popLayout" initial={false}>
        <Child key={segment}>
          {props.children}
        </Child>
      </AnimatePresence>
      <AnimatePresence>
        {modalShown && <Modal>{props.modal}</Modal>}
      </AnimatePresence>
    </>
  )
}
