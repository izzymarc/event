import * as React from "react"
import { XCircle } from "lucide-react"

import { cn } from "../../lib/utils"

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full rounded-md border border-destructive px-4 py-3 text-sm text-destructive [&_svg]:absolute [&_svg:first-child]:left-4 [&_svg:last-child]:right-4 [&_svg]:top-5",
        className
      )}
      {...props}
    >
      <XCircle className="h-4 w-4" />
      <div className="ml-5 font-medium">
        {children}
      </div>
    </div>
  )
})
Alert.displayName = "Alert"

export { Alert }
