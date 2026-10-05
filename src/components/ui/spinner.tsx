import { cn } from "cn"
import type { IconBaseProps } from "react-icons"
import { LuLoaderCircle } from "react-icons/lu"

function Spinner({ className, ...props }: IconBaseProps) {
  return (
    <LuLoaderCircle
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
