import React from 'react';
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

const Tooltip = ({
  content,
  children,
  className,
  side = 'top',
  align = 'center',
}: TooltipProps) => {
  // Convert content to string if it's a React node
  const tooltipContent = typeof content === 'string' ? content : React.isValidElement(content) ? 'Tooltip' : String(content);

  return (
    <div 
      className={cn(
        "group relative inline-block",
        className
      )}
    >
      <div className="inline-block">
        {children}
      </div>
      <div
        className={cn(
          "invisible group-hover:visible opacity-0 group-hover:opacity-100",
          "absolute z-50 px-3 py-1.5 rounded-md",
          "bg-popover text-popover-foreground shadow-md text-sm",
          "transition-all duration-200",
          {
            "-translate-y-full -mt-2": side === 'top',
            "translate-x-full ml-2": side === 'right',
            "translate-y-full mt-2": side === 'bottom',
            "-translate-x-full -ml-2": side === 'left',
          },
          {
            "left-0": align === 'start',
            "left-1/2 -translate-x-1/2": align === 'center',
            "right-0": align === 'end',
          }
        )}
        role="tooltip"
      >
        {content}
      </div>
    </div>
  );
};

export { Tooltip };
