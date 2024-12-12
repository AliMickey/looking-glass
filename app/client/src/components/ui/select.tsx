import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full appearance-none items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
      </div>
    )
  }
)
Select.displayName = "Select"

interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode
}

const Option = React.forwardRef<HTMLOptionElement, OptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <option
        ref={ref}
        className={cn("relative py-1.5 pl-8 pr-2 text-sm", className)}
        {...props}
      >
        {children}
      </option>
    )
  }
)
Option.displayName = "Option"

interface OptGroupProps extends React.OptgroupHTMLAttributes<HTMLOptGroupElement> {
  children: React.ReactNode
}

const OptGroup = React.forwardRef<HTMLOptGroupElement, OptGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <optgroup
        ref={ref}
        className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
        {...props}
      >
        {children}
      </optgroup>
    )
  }
)
OptGroup.displayName = "OptGroup"

export { Select, Option, OptGroup }
