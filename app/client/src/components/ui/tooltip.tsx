import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  delay?: number
  className?: string
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  delay = 200,
  className,
}) => {
  const [show, setShow] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setShow(true), delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setShow(false)
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {show && (
        <div
          className={cn(
            "absolute z-50 px-3 py-1.5 text-sm",
            "rounded-md border bg-popover text-popover-foreground shadow-md",
            "animate-in fade-in-0 zoom-in-95",
            className
          )}
          style={{
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%) translateY(-4px)",
          }}
        >
          {content}
        </div>
      )}
    </div>
  )
}

export { Tooltip }
