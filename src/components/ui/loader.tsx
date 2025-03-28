import * as React from "react"
import { cn } from "@/lib/utils"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg"
  text?: string
}

export function Loader({ size = "default", text, className, ...props }: LoaderProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-12 w-12",
    lg: "h-16 w-16"
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)} {...props}>
      <div className={cn(
        "animate-spin rounded-full border-t-2 border-b-2 border-primary",
        sizeClasses[size]
      )} />
      {text && <p className="mt-4 text-muted-foreground">{text}</p>}
    </div>
  )
} 