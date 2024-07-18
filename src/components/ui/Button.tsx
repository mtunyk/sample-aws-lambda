import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'
import { clsx } from 'clsx'
import {
  Button as MuiButton,
  ButtonOwnerState,
  ButtonProps,
} from '@mui/base/Button'

const Button = forwardRef(function Button(
  { className, ...props }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <MuiButton
      slotProps={{
        root: (state: ButtonOwnerState) => ({
          className: clsx('px-2 py-3.5 w-60 whitespace-nowrap transition-colors rounded border outline-0',
            state.active && 'scale-[0.99] hover:shadow-none',
            state.disabled && 'border-grayishViolet text-grayishViolet cursor-not-allowed',
            !state.disabled && 'border-green-500 text-green-500 hover:text-green-600 hover:bg-green-50 hover:shadow',
            className),
        }),
      }}
      ref={ref}
      {...props}
    />
  )
})

export default Button
