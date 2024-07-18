'use client'

// the components exported from this file have function props which are non-serializable
// therefore they are additionally wrapped with 'use client' here
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#passing-props-from-server-to-client-components-serialization

import React from 'react'
import { SelectRootSlotProps } from '@mui/base/Select'

const SelectButton = React.forwardRef(function SelectButton<
  TValue extends {},
  Multiple extends boolean,
>(props: SelectRootSlotProps<TValue, Multiple>, ref: React.ForwardedRef<HTMLButtonElement>) {
  const { ownerState, ...other } = props

  return (
    <button type="button" {...other} ref={ref}>
      {other.children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="text-base absolute h-full top-0 right-1"
      >
        <path d="m7 10 5 5 5-5H7z" />
      </svg>
    </button>
  )
})

export default SelectButton
