import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-[var(--text-primary)] shadow-sm transition-colors outline-none placeholder:text-slate-400 focus-visible:border-violet-400/60 focus-visible:ring-3 focus-visible:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
