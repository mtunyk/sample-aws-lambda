'use client'

// the components exported from this file have function props which are non-serializable
// therefore they are additionally wrapped with 'use client' here
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#passing-props-from-server-to-client-components-serialization

import React from 'react'
import clsx from 'clsx'
import { Option, OptionProps, OptionOwnerState } from '@mui/base/Option'

function SelectOption(props: OptionProps<string>) {
  const {
    slotProps = {
      root: {},
    },
    ...rest
  } = props

  return (
    <Option
      slotProps={{
        root: (ownerState: OptionOwnerState<string>) => ({
          ...slotProps.root,
          className: clsx(
            'list-none p-2 rounded-[1px] cursor-pointer last-of-type:border-b-0',
            ownerState.selected && 'bg-blue-100 text-blue-900',
            ownerState.highlighted && 'bg-gray-100 text-gray-900',
            ownerState.highlighted && ownerState.selected && 'bg-gray-700 text-gray-50',
            ownerState.disabled ? 'text-gray-400' : 'hover:bg-gray-100, hover:text-gray-300',
          ),
        }),
      }}
      {...rest}
    />
  )
}

export default SelectOption
