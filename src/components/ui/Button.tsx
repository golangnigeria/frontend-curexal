import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-400 text-white hover:bg-primary-500 shadow-sm hover:shadow-md hover:-translate-y-0.5",
        primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md hover:-translate-y-0.5",
        secondary: "bg-accent-100 text-accent-900 hover:bg-accent-200",
        outline: "border-2 border-border bg-transparent hover:bg-accent-50 text-accent-900",
        ghost: "hover:bg-accent-50 text-accent-700 hover:text-accent-900",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
