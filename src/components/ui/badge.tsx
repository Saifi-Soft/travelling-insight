
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-custom-green text-white hover:bg-custom-green/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-custom-green border-custom-green/30 hover:bg-custom-green/10",
        blue: "bg-blue-500 text-white hover:bg-blue-600",
        category: "bg-blue-500 text-white hover:bg-blue-600 rounded-md py-1.5 px-3",
        culture: "bg-[#9b87f5] text-white hover:bg-[#9b87f5]/90 rounded-md py-1.5 px-3",
        beaches: "bg-blue-600 text-white hover:bg-blue-700 rounded-md py-1.5 px-3",
        discover: "bg-blue-200 text-blue-800 hover:bg-blue-300 rounded-md py-1.5 px-3",
        tag: "bg-custom-green/10 text-custom-green border-custom-green/30 hover:bg-custom-green/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
